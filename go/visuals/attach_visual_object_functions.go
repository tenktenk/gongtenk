package visuals

import (
	"fmt"
	"log"
	"sort"
	"time"

	gongtenk_models "github.com/tenktenk/gongtenk/go/models"

	gongleaflet_icons "github.com/fullstack-lang/gongleaflet/go/icons"
	gongleaflet_models "github.com/fullstack-lang/gongleaflet/go/models"

	translate_models "github.com/tenktenk/translate/go/models"
)

// attachVisualTrack attaches a visual track to track
func attachVisualTrack(track gongleaflet_models.VisualTrackInterface,
	divIcon *gongleaflet_models.DivIcon,
	colorEnum gongleaflet_models.ColorEnum,
	displayTrackHistory bool,
	displayLevelAndSpeed bool) {

	// sometimes, the visual icon is nil (not reproductible bug)
	if divIcon == nil {
		log.Fatal("nil visual icon")
	}

	visualTrack := new(gongleaflet_models.VisualTrack).Stage()
	visualTrack.VisualTrackInterface = track
	visualTrack.DivIcon = divIcon
	visualTrack.DisplayTrackHistory = displayTrackHistory
	visualTrack.DisplayLevelAndSpeed = displayLevelAndSpeed
	visualTrack.ColorEnum = colorEnum
	visualTrack.UpdateTrack()
}

// attach visual center to center
func attachMarker(
	visualCenterInterface gongleaflet_models.MarkerInterface,
	colorEnum gongleaflet_models.ColorEnum,
	divIcon *gongleaflet_models.DivIcon) {
	if divIcon == nil {
		log.Fatal("nil visual icon")
	}
	visualCenter := new(gongleaflet_models.Marker).Stage()
	visualCenter.MarkerInteface = visualCenterInterface
	visualCenter.ColorEnum = colorEnum
	visualCenter.DivIcon = divIcon
	visualCenter.UpdateMarker()
}

// map to store relationship between user click and individuals
var mapUserClick_Individual = make(map[*gongleaflet_models.UserClick]*gongtenk_models.Individual)
var mapCity_VisualTrack = make(map[*gongtenk_models.City]*gongleaflet_models.VisualTrack)

func AttachVisualElementsToModelElements() {

	// reset all tracks
	cityOrdered := []*gongtenk_models.City{}
	for city := range gongtenk_models.Stage.Citys {
		cityOrdered = append(cityOrdered, city)
	}
	// sort cities according to their population
	sort.Slice(cityOrdered[:], func(i, j int) bool {
		return cityOrdered[i].Population > cityOrdered[j].Population
	})

	// checkout the number of cities to display
	gongtenk_models.ConfigurationSingloton.Checkout()

	var gongleafletNeedCommit bool
	for index, city := range cityOrdered {

		visualTrack := mapCity_VisualTrack[city]

		//
		// 1. Cities to not display
		//
		// since there are twin cities, one need to multiply by 2
		if index >= gongtenk_models.ConfigurationSingloton.NumberOfCitiesToDisplay*2 {
			// delete the track
			if visualTrack != nil {
				visualTrack.Unstage()
				delete(mapCity_VisualTrack, city)
				gongleafletNeedCommit = true
			}
			continue
		}

		//
		// 2. Cities to display
		//
		if visualTrack == nil {
			if city.Twin {
				visualTrack = gongleaflet_models.AttachVisualTrack(city, gongleaflet_icons.Dot_10Icon, gongleaflet_models.GREY, false, false)
			} else {
				visualTrack = gongleaflet_models.AttachVisualTrack(city, gongleaflet_icons.Dot_10Icon, gongleaflet_models.GREEN, false, false)
			}
			mapCity_VisualTrack[city] = visualTrack
			gongleafletNeedCommit = true
		}
	}
	if gongleafletNeedCommit {
		gongleaflet_models.Stage.Commit()
	}

	for userClick := range gongleaflet_models.Stage.UserClicks {

		if mapUserClick_Individual[userClick] == nil {

			//
			// fetch which country
			//
			currentTranslation := translate_models.GetTranslateCurrent()
			_ = currentTranslation

			individual := (&gongtenk_models.Individual{
				Name: fmt.Sprintf("%f %f", userClick.Lat, userClick.Lng),
				Lat:  userClick.Lat,
				Lng:  userClick.Lng,
			}).Stage()
			mapUserClick_Individual[userClick] = individual

			// creates the twin
			if individual.Lng > -30 {
				currentTranslation.SetSourceCountry("fra")
				currentTranslation.SetTargetCountry("hti")
			} else {
				currentTranslation.SetSourceCountry("hti")
				currentTranslation.SetTargetCountry("fra")
			}

			_, _, _, xSpread, ySpread, _ :=
				currentTranslation.BodyCoordsInSourceCountry(individual.Lat, individual.Lng)
			individual.Name = fmt.Sprintf("%.1f %.1f", xSpread*100.0, ySpread*100.0)
			gongleaflet_models.AttachMarker(individual, gongleaflet_models.GREY, gongleaflet_icons.Dot_10Icon)

			latTarget, lngTarget := currentTranslation.LatLngToXYInTargetCountry(xSpread, ySpread)
			individual.TwinLat = latTarget
			individual.TwinLng = lngTarget

			twinIndividual := new(gongtenk_models.Individual).Stage()
			*twinIndividual = *individual
			twinIndividual.Lat = individual.TwinLat
			twinIndividual.Lng = individual.TwinLng
			twinIndividual.Twin = true

			gongtenk_models.Stage.Commit()

			gongleaflet_models.AttachMarker(twinIndividual, gongleaflet_models.GREY, gongleaflet_icons.Dot_10Icon)
			gongleaflet_models.Stage.Commit()
		}
	}
}

func StartVisualObjectRefresherThread() {

	go func() {

		var commitNb uint
		var commitNbFromFront uint

		var gongleafletUserClick int

		for true {

			if gongtenk_models.Stage.BackRepo != nil {
				// check if commit nb has increased
				if commitNb < gongtenk_models.Stage.BackRepo.GetLastCommitNb() {
					commitNb = gongtenk_models.Stage.BackRepo.GetLastCommitNb()
					fmt.Println("Backend Commit increased")
					AttachVisualElementsToModelElements()
				}
				if commitNbFromFront < gongtenk_models.Stage.BackRepo.GetLastPushFromFrontNb() {
					commitNbFromFront = gongtenk_models.Stage.BackRepo.GetLastPushFromFrontNb()
					fmt.Println("Front Commit increased")
					AttachVisualElementsToModelElements()
				}
			}

			if gongleafletUserClick < len(gongleaflet_models.Stage.UserClicks) {
				gongleafletUserClick = len(gongleaflet_models.Stage.UserClicks)

				fmt.Println("Nb user click increased")
				AttachVisualElementsToModelElements()
			}

			//
			time.Sleep(500 * time.Microsecond)
		}
	}()
}
