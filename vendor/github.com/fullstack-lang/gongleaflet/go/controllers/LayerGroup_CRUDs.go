// generated by stacks/gong/go/models/controller_file.go
package controllers

import (
	"log"
	"net/http"
	"time"

	"github.com/fullstack-lang/gongleaflet/go/models"
	"github.com/fullstack-lang/gongleaflet/go/orm"

	"github.com/gin-gonic/gin"
)

// declaration in order to justify use of the models import
var __LayerGroup__dummysDeclaration__ models.LayerGroup
var __LayerGroup_time__dummyDeclaration time.Duration

// An LayerGroupID parameter model.
//
// This is used for operations that want the ID of an order in the path
// swagger:parameters getLayerGroup updateLayerGroup deleteLayerGroup
type LayerGroupID struct {
	// The ID of the order
	//
	// in: path
	// required: true
	ID int64
}

// LayerGroupInput is a schema that can validate the user’s
// input to prevent us from getting invalid data
// swagger:parameters postLayerGroup updateLayerGroup
type LayerGroupInput struct {
	// The LayerGroup to submit or modify
	// in: body
	LayerGroup *orm.LayerGroupAPI
}

// GetLayerGroups
//
// swagger:route GET /layergroups layergroups getLayerGroups
//
// Get all layergroups
//
// Responses:
//    default: genericError
//        200: layergroupDBsResponse
func GetLayerGroups(c *gin.Context) {
	db := orm.BackRepo.BackRepoLayerGroup.GetDB()

	// source slice
	var layergroupDBs []orm.LayerGroupDB
	query := db.Find(&layergroupDBs)
	if query.Error != nil {
		var returnError GenericError
		returnError.Body.Code = http.StatusBadRequest
		returnError.Body.Message = query.Error.Error()
		log.Println(query.Error.Error())
		c.JSON(http.StatusBadRequest, returnError.Body)
		return
	}

	// slice that will be transmitted to the front
	layergroupAPIs := make([]orm.LayerGroupAPI, 0)

	// for each layergroup, update fields from the database nullable fields
	for idx := range layergroupDBs {
		layergroupDB := &layergroupDBs[idx]
		_ = layergroupDB
		var layergroupAPI orm.LayerGroupAPI

		// insertion point for updating fields
		layergroupAPI.ID = layergroupDB.ID
		layergroupDB.CopyBasicFieldsToLayerGroup(&layergroupAPI.LayerGroup)
		layergroupAPI.LayerGroupPointersEnconding = layergroupDB.LayerGroupPointersEnconding
		layergroupAPIs = append(layergroupAPIs, layergroupAPI)
	}

	c.JSON(http.StatusOK, layergroupAPIs)
}

// PostLayerGroup
//
// swagger:route POST /layergroups layergroups postLayerGroup
//
// Creates a layergroup
//     Consumes:
//     - application/json
//
//     Produces:
//     - application/json
//
//     Responses:
//       200: layergroupDBResponse
func PostLayerGroup(c *gin.Context) {
	db := orm.BackRepo.BackRepoLayerGroup.GetDB()

	// Validate input
	var input orm.LayerGroupAPI

	err := c.ShouldBindJSON(&input)
	if err != nil {
		var returnError GenericError
		returnError.Body.Code = http.StatusBadRequest
		returnError.Body.Message = err.Error()
		log.Println(err.Error())
		c.JSON(http.StatusBadRequest, returnError.Body)
		return
	}

	// Create layergroup
	layergroupDB := orm.LayerGroupDB{}
	layergroupDB.LayerGroupPointersEnconding = input.LayerGroupPointersEnconding
	layergroupDB.CopyBasicFieldsFromLayerGroup(&input.LayerGroup)

	query := db.Create(&layergroupDB)
	if query.Error != nil {
		var returnError GenericError
		returnError.Body.Code = http.StatusBadRequest
		returnError.Body.Message = query.Error.Error()
		log.Println(query.Error.Error())
		c.JSON(http.StatusBadRequest, returnError.Body)
		return
	}

	// a POST is equivalent to a back repo commit increase
	// (this will be improved with implementation of unit of work design pattern)
	orm.BackRepo.IncrementPushFromFrontNb()

	c.JSON(http.StatusOK, layergroupDB)
}

// GetLayerGroup
//
// swagger:route GET /layergroups/{ID} layergroups getLayerGroup
//
// Gets the details for a layergroup.
//
// Responses:
//    default: genericError
//        200: layergroupDBResponse
func GetLayerGroup(c *gin.Context) {
	db := orm.BackRepo.BackRepoLayerGroup.GetDB()

	// Get layergroupDB in DB
	var layergroupDB orm.LayerGroupDB
	if err := db.First(&layergroupDB, c.Param("id")).Error; err != nil {
		var returnError GenericError
		returnError.Body.Code = http.StatusBadRequest
		returnError.Body.Message = err.Error()
		log.Println(err.Error())
		c.JSON(http.StatusBadRequest, returnError.Body)
		return
	}

	var layergroupAPI orm.LayerGroupAPI
	layergroupAPI.ID = layergroupDB.ID
	layergroupAPI.LayerGroupPointersEnconding = layergroupDB.LayerGroupPointersEnconding
	layergroupDB.CopyBasicFieldsToLayerGroup(&layergroupAPI.LayerGroup)

	c.JSON(http.StatusOK, layergroupAPI)
}

// UpdateLayerGroup
//
// swagger:route PATCH /layergroups/{ID} layergroups updateLayerGroup
//
// Update a layergroup
//
// Responses:
//    default: genericError
//        200: layergroupDBResponse
func UpdateLayerGroup(c *gin.Context) {
	db := orm.BackRepo.BackRepoLayerGroup.GetDB()

	// Get model if exist
	var layergroupDB orm.LayerGroupDB

	// fetch the layergroup
	query := db.First(&layergroupDB, c.Param("id"))

	if query.Error != nil {
		var returnError GenericError
		returnError.Body.Code = http.StatusBadRequest
		returnError.Body.Message = query.Error.Error()
		log.Println(query.Error.Error())
		c.JSON(http.StatusBadRequest, returnError.Body)
		return
	}

	// Validate input
	var input orm.LayerGroupAPI
	if err := c.ShouldBindJSON(&input); err != nil {
		log.Println(err.Error())
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// update
	layergroupDB.CopyBasicFieldsFromLayerGroup(&input.LayerGroup)
	layergroupDB.LayerGroupPointersEnconding = input.LayerGroupPointersEnconding

	query = db.Model(&layergroupDB).Updates(layergroupDB)
	if query.Error != nil {
		var returnError GenericError
		returnError.Body.Code = http.StatusBadRequest
		returnError.Body.Message = query.Error.Error()
		log.Println(query.Error.Error())
		c.JSON(http.StatusBadRequest, returnError.Body)
		return
	}

	// an UPDATE generates a back repo commit increase
	// (this will be improved with implementation of unit of work design pattern)
	orm.BackRepo.IncrementPushFromFrontNb()

	// return status OK with the marshalling of the the layergroupDB
	c.JSON(http.StatusOK, layergroupDB)
}

// DeleteLayerGroup
//
// swagger:route DELETE /layergroups/{ID} layergroups deleteLayerGroup
//
// Delete a layergroup
//
// Responses:
//    default: genericError
func DeleteLayerGroup(c *gin.Context) {
	db := orm.BackRepo.BackRepoLayerGroup.GetDB()

	// Get model if exist
	var layergroupDB orm.LayerGroupDB
	if err := db.First(&layergroupDB, c.Param("id")).Error; err != nil {
		var returnError GenericError
		returnError.Body.Code = http.StatusBadRequest
		returnError.Body.Message = err.Error()
		log.Println(err.Error())
		c.JSON(http.StatusBadRequest, returnError.Body)
		return
	}

	// with gorm.Model field, default delete is a soft delete. Unscoped() force delete
	db.Unscoped().Delete(&layergroupDB)

	// a DELETE generates a back repo commit increase
	// (this will be improved with implementation of unit of work design pattern)
	orm.BackRepo.IncrementPushFromFrontNb()

	c.JSON(http.StatusOK, gin.H{"data": true})
}
