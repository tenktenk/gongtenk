package models

// VLine provides all necessary elements to the front to display a line in leaflet
//
// back to VLine because if Line breacks the chrome navigator (to be investigated)
//
// swagger:model VLine
type VLine struct {
	StartLat, StartLng float64
	EndLat, EndLng     float64
	Name               string

	ColorEnum     ColorEnum
	DashStyleEnum DashStyleEnum

	// LayerGroup the object belongs to
	LayerGroup *LayerGroup

	IsTransmitting TransmittingEnum // display the message displacement
	Message        string           // message to display

	IsTransmittingBackward TransmittingEnum // display the message displacement on the return path
	MessageBackward        string           // message to display

	// swagger:ignore
	// access to the models instance that contains the original information
	LineInterface LineInterface `gorm:"-"`
}

// for the moment, the angular front end does not get booleans, therefore, we translate the
// booleans into enums

// TransmittingEnum ..
// swagger:enum TransmittingEnum
type TransmittingEnum string

// state
const (
	IS_TRANSMITTING     TransmittingEnum = "IS_TRANSMITTING"
	IS_NOT_TRANSMITTING TransmittingEnum = "IS_NOT_TRANSMITTING"
)

// Start_To_End_Enum ..
// swagger:enum Start_To_End_Enum
type Start_To_End_Enum string

// state
const (
	FORWARD_START_TO_END  Start_To_End_Enum = "FORWARD_START_TO_END"
	BACKWARD_END_TO_START Start_To_End_Enum = "BACKWARD_START_TO_END"
)

type LineInterface interface {
	GetStartLat() (lat float64)
	GetStartLng() (lng float64)

	GetEndLat() (lat float64)
	GetEndLng() (lng float64)

	GetName() (name string)

	GetLayerGroupName() string

	// transmission
	GetIsTransmitting() bool // display the message displacement
	GetMessage() string      // message to display

	GetIsTransmittingBackward() bool // display the message displacement
	GetMessageBackward() string      // message to display

}

func (visualLine *VLine) UpdateLine() {
	if visualLine.LineInterface != nil {
		visualLine.Name = visualLine.LineInterface.GetName()

		visualLine.StartLat = visualLine.LineInterface.GetStartLat()
		visualLine.StartLng = visualLine.LineInterface.GetStartLng()

		visualLine.EndLat = visualLine.LineInterface.GetEndLat()
		visualLine.EndLng = visualLine.LineInterface.GetEndLng()

		visualLine.LayerGroup =
			computeLayerGroupFromLayerGroupName(visualLine.LineInterface.GetLayerGroupName())

		// transmission status
		if visualLine.LineInterface.GetIsTransmitting() {
			visualLine.IsTransmitting = IS_TRANSMITTING
		} else {
			visualLine.IsTransmitting = IS_NOT_TRANSMITTING
		}
		visualLine.Message = visualLine.LineInterface.GetMessage()

		// transmission status
		if visualLine.LineInterface.GetIsTransmittingBackward() {
			visualLine.IsTransmittingBackward = IS_TRANSMITTING
		} else {
			visualLine.IsTransmittingBackward = IS_NOT_TRANSMITTING
		}
		visualLine.MessageBackward = visualLine.LineInterface.GetMessageBackward()

	}
}
