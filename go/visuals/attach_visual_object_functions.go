package visuals

import (
	"fmt"
	"log"
	"sort"
	"time"

	"github.com/tenktenk/gongtenk/go/models"

	gongleaflet_icons "github.com/fullstack-lang/gongleaflet/go/icons"
	gongleaflet_models "github.com/fullstack-lang/gongleaflet/go/models"
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
var mapUserClick_Individual = make(map[*gongleaflet_models.UserClick]*models.Individual)

func AttachVisualElementsToModelElements() {

	// reset all tracks
	gongleaflet_models.Stage.VisualTracks = make(map[*gongleaflet_models.VisualTrack]struct{})
	gongleaflet_models.Stage.VisualTracks_mapString = make(map[string]*gongleaflet_models.VisualTrack)
	gongleaflet_models.Stage.Commit()

	cityOrdered := []*models.City{}
	for city := range models.Stage.Citys {
		cityOrdered = append(cityOrdered, city)
	}
	// sort cities according to their population
	sort.Slice(cityOrdered[:], func(i, j int) bool {
		return cityOrdered[i].Population > cityOrdered[j].Population
	})

	// checkout the number of cities
	models.ConfigurationSingloton.Checkout()

	for index, city := range cityOrdered {
		_ = city

		// since there are twin cities, one need to multiply by 2
		if index > models.ConfigurationSingloton.NumberOfCitiesToDisplay*2 {
			continue
		}

		if city.Twin {
			gongleaflet_models.AttachVisualTrack(city, gongleaflet_icons.Dot_10Icon, gongleaflet_models.GREY, false, false)
		} else {
			gongleaflet_models.AttachVisualTrack(city, gongleaflet_icons.Dot_10Icon, gongleaflet_models.GREEN, false, false)
		}
		gongleaflet_models.Stage.Commit()
	}

	// reset all markers
	gongleaflet_models.Stage.Markers = make(map[*gongleaflet_models.Marker]struct{})
	gongleaflet_models.Stage.Markers_mapString = make(map[string]*gongleaflet_models.Marker)
	gongleaflet_models.Stage.Commit()

	for userClick := range gongleaflet_models.Stage.UserClicks {

		if mapUserClick_Individual[userClick] == nil {
			individual := (&models.Individual{
				Name: fmt.Sprintf("%f %f", userClick.Lat, userClick.Lng),
				Lat:  userClick.Lat,
				Lng:  userClick.Lng,
			}).Stage().Commit()
			mapUserClick_Individual[userClick] = individual

			gongleaflet_models.AttachMarker(individual, gongleaflet_models.GREY, gongleaflet_icons.Dot_10Icon)

		}
	}
	gongleaflet_models.Stage.Commit()

}

func StartVisualObjectRefresherThread() {

	go func() {

		var commitNb uint
		var commitNbFromFront uint

		var gongleafletUserClick int

		for true {

			if models.Stage.BackRepo != nil {
				// check if commit nb has increased
				if commitNb < models.Stage.BackRepo.GetLastCommitNb() {
					commitNb = models.Stage.BackRepo.GetLastCommitNb()
					fmt.Println("Backend Commit increased")
					AttachVisualElementsToModelElements()
				}
				if commitNbFromFront < models.Stage.BackRepo.GetLastPushFromFrontNb() {
					commitNbFromFront = models.Stage.BackRepo.GetLastPushFromFrontNb()
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
