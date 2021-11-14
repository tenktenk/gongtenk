package models

import (
	"fmt"
	"time"
)

type CheckoutScheduler struct {
	Name               string
	NbUpdatesFromFront int
}

var CheckoutSchedulerSingloton = (&CheckoutScheduler{
	Name: "Checkout Scheduler Singloton",
}).Stage()

func init() {
	CheckoutSchedulerSingloton.StartThread()
}

func (checkoutScheduler *CheckoutScheduler) StartThread() {

	ticker := time.NewTicker(500 * time.Millisecond)
	done := make(chan bool)

	go func() {

		var lastCommitNbFromFront uint
		for {
			select {
			case <-done:
				return
			case t := <-ticker.C:
				_ = t
				// fmt.Println("Tick at", t.Second(), " Plane lat ", Plane.Lat,
				// 	" commit from the front ", Stage.BackRepo.GetLastPushFromFrontNb())

				// check out modifications initiated by the front
				if Stage.BackRepo != nil {
					if lastCommitNbFromFront < Stage.BackRepo.GetLastPushFromFrontNb() {

						Stage.Checkout()
						fmt.Println("Checking out")
						checkoutScheduler.NbUpdatesFromFront = checkoutScheduler.NbUpdatesFromFront + 1
						lastCommitNbFromFront = Stage.BackRepo.GetLastPushFromFrontNb()
					}
				}
			}
		}
	}()
}
