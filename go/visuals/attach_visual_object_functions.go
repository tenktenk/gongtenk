package visuals

import (
	"fmt"
	"log"
	"sort"
	"time"

	"github.com/thomaspeugeot/gongtenk/go/models"

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

// attach visual line to line
func attachLine(
	visualLineInterface gongleaflet_models.LineInterface,
	DashStyleEnum gongleaflet_models.DashStyleEnum) {
	visualLine := new(gongleaflet_models.VLine).Stage()
	visualLine.DashStyleEnum = DashStyleEnum
	visualLine.LineInterface = visualLineInterface
	visualLine.UpdateLine()
}

// attach visual circle to circle
func attachCircle(
	visualCircleInterface gongleaflet_models.CircleInterface,
	DashStyleEnum gongleaflet_models.DashStyleEnum) {
	visualCircle := new(gongleaflet_models.Circle).Stage()
	visualCircle.DashStyleEnum = DashStyleEnum
	visualCircle.Circle = visualCircleInterface
	visualCircle.UpdateCircle()
}

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
			attachVisualTrack(city, gongleaflet_icons.Dot_10Icon, gongleaflet_models.GREY, false, false)
		} else {
			attachVisualTrack(city, gongleaflet_icons.Dot_10Icon, gongleaflet_models.GREEN, false, false)
		}
		gongleaflet_models.Stage.Commit()
	}
}

func StartVisualObjectRefresherThread() {

	go func() {

		var commitNb uint
		var commitNbFromFront uint

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
				time.Sleep(1 * time.Second)
			}
		}
	}()
}
