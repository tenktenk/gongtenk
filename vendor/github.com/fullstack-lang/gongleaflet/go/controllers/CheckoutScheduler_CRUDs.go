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
var __CheckoutScheduler__dummysDeclaration__ models.CheckoutScheduler
var __CheckoutScheduler_time__dummyDeclaration time.Duration

// An CheckoutSchedulerID parameter model.
//
// This is used for operations that want the ID of an order in the path
// swagger:parameters getCheckoutScheduler updateCheckoutScheduler deleteCheckoutScheduler
type CheckoutSchedulerID struct {
	// The ID of the order
	//
	// in: path
	// required: true
	ID int64
}

// CheckoutSchedulerInput is a schema that can validate the user’s
// input to prevent us from getting invalid data
// swagger:parameters postCheckoutScheduler updateCheckoutScheduler
type CheckoutSchedulerInput struct {
	// The CheckoutScheduler to submit or modify
	// in: body
	CheckoutScheduler *orm.CheckoutSchedulerAPI
}

// GetCheckoutSchedulers
//
// swagger:route GET /checkoutschedulers checkoutschedulers getCheckoutSchedulers
//
// Get all checkoutschedulers
//
// Responses:
//    default: genericError
//        200: checkoutschedulerDBsResponse
func GetCheckoutSchedulers(c *gin.Context) {
	db := orm.BackRepo.BackRepoCheckoutScheduler.GetDB()

	// source slice
	var checkoutschedulerDBs []orm.CheckoutSchedulerDB
	query := db.Find(&checkoutschedulerDBs)
	if query.Error != nil {
		var returnError GenericError
		returnError.Body.Code = http.StatusBadRequest
		returnError.Body.Message = query.Error.Error()
		log.Println(query.Error.Error())
		c.JSON(http.StatusBadRequest, returnError.Body)
		return
	}

	// slice that will be transmitted to the front
	checkoutschedulerAPIs := make([]orm.CheckoutSchedulerAPI, 0)

	// for each checkoutscheduler, update fields from the database nullable fields
	for idx := range checkoutschedulerDBs {
		checkoutschedulerDB := &checkoutschedulerDBs[idx]
		_ = checkoutschedulerDB
		var checkoutschedulerAPI orm.CheckoutSchedulerAPI

		// insertion point for updating fields
		checkoutschedulerAPI.ID = checkoutschedulerDB.ID
		checkoutschedulerDB.CopyBasicFieldsToCheckoutScheduler(&checkoutschedulerAPI.CheckoutScheduler)
		checkoutschedulerAPI.CheckoutSchedulerPointersEnconding = checkoutschedulerDB.CheckoutSchedulerPointersEnconding
		checkoutschedulerAPIs = append(checkoutschedulerAPIs, checkoutschedulerAPI)
	}

	c.JSON(http.StatusOK, checkoutschedulerAPIs)
}

// PostCheckoutScheduler
//
// swagger:route POST /checkoutschedulers checkoutschedulers postCheckoutScheduler
//
// Creates a checkoutscheduler
//     Consumes:
//     - application/json
//
//     Produces:
//     - application/json
//
//     Responses:
//       200: checkoutschedulerDBResponse
func PostCheckoutScheduler(c *gin.Context) {
	db := orm.BackRepo.BackRepoCheckoutScheduler.GetDB()

	// Validate input
	var input orm.CheckoutSchedulerAPI

	err := c.ShouldBindJSON(&input)
	if err != nil {
		var returnError GenericError
		returnError.Body.Code = http.StatusBadRequest
		returnError.Body.Message = err.Error()
		log.Println(err.Error())
		c.JSON(http.StatusBadRequest, returnError.Body)
		return
	}

	// Create checkoutscheduler
	checkoutschedulerDB := orm.CheckoutSchedulerDB{}
	checkoutschedulerDB.CheckoutSchedulerPointersEnconding = input.CheckoutSchedulerPointersEnconding
	checkoutschedulerDB.CopyBasicFieldsFromCheckoutScheduler(&input.CheckoutScheduler)

	query := db.Create(&checkoutschedulerDB)
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

	c.JSON(http.StatusOK, checkoutschedulerDB)
}

// GetCheckoutScheduler
//
// swagger:route GET /checkoutschedulers/{ID} checkoutschedulers getCheckoutScheduler
//
// Gets the details for a checkoutscheduler.
//
// Responses:
//    default: genericError
//        200: checkoutschedulerDBResponse
func GetCheckoutScheduler(c *gin.Context) {
	db := orm.BackRepo.BackRepoCheckoutScheduler.GetDB()

	// Get checkoutschedulerDB in DB
	var checkoutschedulerDB orm.CheckoutSchedulerDB
	if err := db.First(&checkoutschedulerDB, c.Param("id")).Error; err != nil {
		var returnError GenericError
		returnError.Body.Code = http.StatusBadRequest
		returnError.Body.Message = err.Error()
		log.Println(err.Error())
		c.JSON(http.StatusBadRequest, returnError.Body)
		return
	}

	var checkoutschedulerAPI orm.CheckoutSchedulerAPI
	checkoutschedulerAPI.ID = checkoutschedulerDB.ID
	checkoutschedulerAPI.CheckoutSchedulerPointersEnconding = checkoutschedulerDB.CheckoutSchedulerPointersEnconding
	checkoutschedulerDB.CopyBasicFieldsToCheckoutScheduler(&checkoutschedulerAPI.CheckoutScheduler)

	c.JSON(http.StatusOK, checkoutschedulerAPI)
}

// UpdateCheckoutScheduler
//
// swagger:route PATCH /checkoutschedulers/{ID} checkoutschedulers updateCheckoutScheduler
//
// Update a checkoutscheduler
//
// Responses:
//    default: genericError
//        200: checkoutschedulerDBResponse
func UpdateCheckoutScheduler(c *gin.Context) {
	db := orm.BackRepo.BackRepoCheckoutScheduler.GetDB()

	// Get model if exist
	var checkoutschedulerDB orm.CheckoutSchedulerDB

	// fetch the checkoutscheduler
	query := db.First(&checkoutschedulerDB, c.Param("id"))

	if query.Error != nil {
		var returnError GenericError
		returnError.Body.Code = http.StatusBadRequest
		returnError.Body.Message = query.Error.Error()
		log.Println(query.Error.Error())
		c.JSON(http.StatusBadRequest, returnError.Body)
		return
	}

	// Validate input
	var input orm.CheckoutSchedulerAPI
	if err := c.ShouldBindJSON(&input); err != nil {
		log.Println(err.Error())
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// update
	checkoutschedulerDB.CopyBasicFieldsFromCheckoutScheduler(&input.CheckoutScheduler)
	checkoutschedulerDB.CheckoutSchedulerPointersEnconding = input.CheckoutSchedulerPointersEnconding

	query = db.Model(&checkoutschedulerDB).Updates(checkoutschedulerDB)
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

	// return status OK with the marshalling of the the checkoutschedulerDB
	c.JSON(http.StatusOK, checkoutschedulerDB)
}

// DeleteCheckoutScheduler
//
// swagger:route DELETE /checkoutschedulers/{ID} checkoutschedulers deleteCheckoutScheduler
//
// Delete a checkoutscheduler
//
// Responses:
//    default: genericError
func DeleteCheckoutScheduler(c *gin.Context) {
	db := orm.BackRepo.BackRepoCheckoutScheduler.GetDB()

	// Get model if exist
	var checkoutschedulerDB orm.CheckoutSchedulerDB
	if err := db.First(&checkoutschedulerDB, c.Param("id")).Error; err != nil {
		var returnError GenericError
		returnError.Body.Code = http.StatusBadRequest
		returnError.Body.Message = err.Error()
		log.Println(err.Error())
		c.JSON(http.StatusBadRequest, returnError.Body)
		return
	}

	// with gorm.Model field, default delete is a soft delete. Unscoped() force delete
	db.Unscoped().Delete(&checkoutschedulerDB)

	// a DELETE generates a back repo commit increase
	// (this will be improved with implementation of unit of work design pattern)
	orm.BackRepo.IncrementPushFromFrontNb()

	c.JSON(http.StatusOK, gin.H{"data": true})
}
