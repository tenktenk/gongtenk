package controllers

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/thomaspeugeot/gongtenk/go/orm"
)

// genQuery return the name of the column
func genQuery(columnName string) string {
	return fmt.Sprintf("%s = ?", columnName)
}

// A GenericError is the default error message that is generated.
// For certain status codes there are more appropriate error structures.
//
// swagger:response genericError
type GenericError struct {
	// in: body
	Body struct {
		Code    int32  `json:"code"`
		Message string `json:"message"`
	} `json:"body"`
}

// A ValidationError is an that is generated for validation failures.
// It has the same fields as a generic error but adds a Field property.
//
// swagger:response validationError
type ValidationError struct {
	// in: body
	Body struct {
		Code    int32  `json:"code"`
		Message string `json:"message"`
		Field   string `json:"field"`
	} `json:"body"`
}

// RegisterControllers register controllers
func RegisterControllers(r *gin.Engine) {
	v1 := r.Group("/api/github.com/thomaspeugeot/gongtenk/go")
	{ // insertion point for registrations
		v1.GET("/v1/citys", GetCitys)
		v1.GET("/v1/citys/:id", GetCity)
		v1.POST("/v1/citys", PostCity)
		v1.PATCH("/v1/citys/:id", UpdateCity)
		v1.PUT("/v1/citys/:id", UpdateCity)
		v1.DELETE("/v1/citys/:id", DeleteCity)

		v1.GET("/v1/configurations", GetConfigurations)
		v1.GET("/v1/configurations/:id", GetConfiguration)
		v1.POST("/v1/configurations", PostConfiguration)
		v1.PATCH("/v1/configurations/:id", UpdateConfiguration)
		v1.PUT("/v1/configurations/:id", UpdateConfiguration)
		v1.DELETE("/v1/configurations/:id", DeleteConfiguration)

		v1.GET("/v1/countrys", GetCountrys)
		v1.GET("/v1/countrys/:id", GetCountry)
		v1.POST("/v1/countrys", PostCountry)
		v1.PATCH("/v1/countrys/:id", UpdateCountry)
		v1.PUT("/v1/countrys/:id", UpdateCountry)
		v1.DELETE("/v1/countrys/:id", DeleteCountry)

		v1.GET("/v1/individuals", GetIndividuals)
		v1.GET("/v1/individuals/:id", GetIndividual)
		v1.POST("/v1/individuals", PostIndividual)
		v1.PATCH("/v1/individuals/:id", UpdateIndividual)
		v1.PUT("/v1/individuals/:id", UpdateIndividual)
		v1.DELETE("/v1/individuals/:id", DeleteIndividual)

		v1.GET("/commitnb", GetLastCommitNb)
		v1.GET("/pushfromfrontnb", GetLastPushFromFrontNb)
	}
}

// swagger:route GET /commitnb backrepo GetLastCommitNb
func GetLastCommitNb(c *gin.Context) {
	res := orm.GetLastCommitNb()

	c.JSON(http.StatusOK, res)
}

// swagger:route GET /pushfromfrontnb backrepo GetLastPushFromFrontNb
func GetLastPushFromFrontNb(c *gin.Context) {
	res := orm.GetLastPushFromFrontNb()

	c.JSON(http.StatusOK, res)
}
