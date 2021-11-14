// generated by stacks/gong/go/models/orm_file_per_struct_back_repo.go
package orm

import (
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"path/filepath"
	"sort"
	"time"

	"gorm.io/gorm"

	"github.com/tealeg/xlsx/v3"

	"github.com/fullstack-lang/gongleaflet/go/models"
)

// dummy variable to have the import declaration wihthout compile failure (even if no code needing this import is generated)
var dummy_UserClick_sql sql.NullBool
var dummy_UserClick_time time.Duration
var dummy_UserClick_sort sort.Float64Slice

// UserClickAPI is the input in POST API
//
// for POST, API, one needs the fields of the model as well as the fields
// from associations ("Has One" and "Has Many") that are generated to
// fullfill the ORM requirements for associations
//
// swagger:model userclickAPI
type UserClickAPI struct {
	gorm.Model

	models.UserClick

	// encoding of pointers
	UserClickPointersEnconding
}

// UserClickPointersEnconding encodes pointers to Struct and
// reverse pointers of slice of poitners to Struct
type UserClickPointersEnconding struct {
	// insertion for pointer fields encoding declaration
}

// UserClickDB describes a userclick in the database
//
// It incorporates the GORM ID, basic fields from the model (because they can be serialized),
// the encoded version of pointers
//
// swagger:model userclickDB
type UserClickDB struct {
	gorm.Model

	// insertion for basic fields declaration

	// Declation for basic field userclickDB.Name {{BasicKind}} (to be completed)
	Name_Data sql.NullString

	// Declation for basic field userclickDB.Lat {{BasicKind}} (to be completed)
	Lat_Data sql.NullFloat64

	// Declation for basic field userclickDB.Lng {{BasicKind}} (to be completed)
	Lng_Data sql.NullFloat64

	// Declation for basic field userclickDB.TimeOfClick
	TimeOfClick_Data sql.NullTime
	// encoding of pointers
	UserClickPointersEnconding
}

// UserClickDBs arrays userclickDBs
// swagger:response userclickDBsResponse
type UserClickDBs []UserClickDB

// UserClickDBResponse provides response
// swagger:response userclickDBResponse
type UserClickDBResponse struct {
	UserClickDB
}

// UserClickWOP is a UserClick without pointers (WOP is an acronym for "Without Pointers")
// it holds the same basic fields but pointers are encoded into uint
type UserClickWOP struct {
	ID int `xlsx:"0"`

	// insertion for WOP basic fields

	Name string `xlsx:"1"`

	Lat float64 `xlsx:"2"`

	Lng float64 `xlsx:"3"`

	TimeOfClick time.Time `xlsx:"4"`
	// insertion for WOP pointer fields
}

var UserClick_Fields = []string{
	// insertion for WOP basic fields
	"ID",
	"Name",
	"Lat",
	"Lng",
	"TimeOfClick",
}

type BackRepoUserClickStruct struct {
	// stores UserClickDB according to their gorm ID
	Map_UserClickDBID_UserClickDB *map[uint]*UserClickDB

	// stores UserClickDB ID according to UserClick address
	Map_UserClickPtr_UserClickDBID *map[*models.UserClick]uint

	// stores UserClick according to their gorm ID
	Map_UserClickDBID_UserClickPtr *map[uint]*models.UserClick

	db *gorm.DB
}

func (backRepoUserClick *BackRepoUserClickStruct) GetDB() *gorm.DB {
	return backRepoUserClick.db
}

// GetUserClickDBFromUserClickPtr is a handy function to access the back repo instance from the stage instance
func (backRepoUserClick *BackRepoUserClickStruct) GetUserClickDBFromUserClickPtr(userclick *models.UserClick) (userclickDB *UserClickDB) {
	id := (*backRepoUserClick.Map_UserClickPtr_UserClickDBID)[userclick]
	userclickDB = (*backRepoUserClick.Map_UserClickDBID_UserClickDB)[id]
	return
}

// BackRepoUserClick.Init set up the BackRepo of the UserClick
func (backRepoUserClick *BackRepoUserClickStruct) Init(db *gorm.DB) (Error error) {

	if backRepoUserClick.Map_UserClickDBID_UserClickPtr != nil {
		err := errors.New("In Init, backRepoUserClick.Map_UserClickDBID_UserClickPtr should be nil")
		return err
	}

	if backRepoUserClick.Map_UserClickDBID_UserClickDB != nil {
		err := errors.New("In Init, backRepoUserClick.Map_UserClickDBID_UserClickDB should be nil")
		return err
	}

	if backRepoUserClick.Map_UserClickPtr_UserClickDBID != nil {
		err := errors.New("In Init, backRepoUserClick.Map_UserClickPtr_UserClickDBID should be nil")
		return err
	}

	tmp := make(map[uint]*models.UserClick, 0)
	backRepoUserClick.Map_UserClickDBID_UserClickPtr = &tmp

	tmpDB := make(map[uint]*UserClickDB, 0)
	backRepoUserClick.Map_UserClickDBID_UserClickDB = &tmpDB

	tmpID := make(map[*models.UserClick]uint, 0)
	backRepoUserClick.Map_UserClickPtr_UserClickDBID = &tmpID

	backRepoUserClick.db = db
	return
}

// BackRepoUserClick.CommitPhaseOne commits all staged instances of UserClick to the BackRepo
// Phase One is the creation of instance in the database if it is not yet done to get the unique ID for each staged instance
func (backRepoUserClick *BackRepoUserClickStruct) CommitPhaseOne(stage *models.StageStruct) (Error error) {

	for userclick := range stage.UserClicks {
		backRepoUserClick.CommitPhaseOneInstance(userclick)
	}

	// parse all backRepo instance and checks wether some instance have been unstaged
	// in this case, remove them from the back repo
	for id, userclick := range *backRepoUserClick.Map_UserClickDBID_UserClickPtr {
		if _, ok := stage.UserClicks[userclick]; !ok {
			backRepoUserClick.CommitDeleteInstance(id)
		}
	}

	return
}

// BackRepoUserClick.CommitDeleteInstance commits deletion of UserClick to the BackRepo
func (backRepoUserClick *BackRepoUserClickStruct) CommitDeleteInstance(id uint) (Error error) {

	userclick := (*backRepoUserClick.Map_UserClickDBID_UserClickPtr)[id]

	// userclick is not staged anymore, remove userclickDB
	userclickDB := (*backRepoUserClick.Map_UserClickDBID_UserClickDB)[id]
	query := backRepoUserClick.db.Unscoped().Delete(&userclickDB)
	if query.Error != nil {
		return query.Error
	}

	// update stores
	delete((*backRepoUserClick.Map_UserClickPtr_UserClickDBID), userclick)
	delete((*backRepoUserClick.Map_UserClickDBID_UserClickPtr), id)
	delete((*backRepoUserClick.Map_UserClickDBID_UserClickDB), id)

	return
}

// BackRepoUserClick.CommitPhaseOneInstance commits userclick staged instances of UserClick to the BackRepo
// Phase One is the creation of instance in the database if it is not yet done to get the unique ID for each staged instance
func (backRepoUserClick *BackRepoUserClickStruct) CommitPhaseOneInstance(userclick *models.UserClick) (Error error) {

	// check if the userclick is not commited yet
	if _, ok := (*backRepoUserClick.Map_UserClickPtr_UserClickDBID)[userclick]; ok {
		return
	}

	// initiate userclick
	var userclickDB UserClickDB
	userclickDB.CopyBasicFieldsFromUserClick(userclick)

	query := backRepoUserClick.db.Create(&userclickDB)
	if query.Error != nil {
		return query.Error
	}

	// update stores
	(*backRepoUserClick.Map_UserClickPtr_UserClickDBID)[userclick] = userclickDB.ID
	(*backRepoUserClick.Map_UserClickDBID_UserClickPtr)[userclickDB.ID] = userclick
	(*backRepoUserClick.Map_UserClickDBID_UserClickDB)[userclickDB.ID] = &userclickDB

	return
}

// BackRepoUserClick.CommitPhaseTwo commits all staged instances of UserClick to the BackRepo
// Phase Two is the update of instance with the field in the database
func (backRepoUserClick *BackRepoUserClickStruct) CommitPhaseTwo(backRepo *BackRepoStruct) (Error error) {

	for idx, userclick := range *backRepoUserClick.Map_UserClickDBID_UserClickPtr {
		backRepoUserClick.CommitPhaseTwoInstance(backRepo, idx, userclick)
	}

	return
}

// BackRepoUserClick.CommitPhaseTwoInstance commits {{structname }} of models.UserClick to the BackRepo
// Phase Two is the update of instance with the field in the database
func (backRepoUserClick *BackRepoUserClickStruct) CommitPhaseTwoInstance(backRepo *BackRepoStruct, idx uint, userclick *models.UserClick) (Error error) {

	// fetch matching userclickDB
	if userclickDB, ok := (*backRepoUserClick.Map_UserClickDBID_UserClickDB)[idx]; ok {

		userclickDB.CopyBasicFieldsFromUserClick(userclick)

		// insertion point for translating pointers encodings into actual pointers
		query := backRepoUserClick.db.Save(&userclickDB)
		if query.Error != nil {
			return query.Error
		}

	} else {
		err := errors.New(
			fmt.Sprintf("Unkown UserClick intance %s", userclick.Name))
		return err
	}

	return
}

// BackRepoUserClick.CheckoutPhaseOne Checkouts all BackRepo instances to the Stage
//
// Phase One will result in having instances on the stage aligned with the back repo
// pointers are not initialized yet (this is for pahse two)
//
func (backRepoUserClick *BackRepoUserClickStruct) CheckoutPhaseOne() (Error error) {

	userclickDBArray := make([]UserClickDB, 0)
	query := backRepoUserClick.db.Find(&userclickDBArray)
	if query.Error != nil {
		return query.Error
	}

	// list of instances to be removed
	// start from the initial map on the stage and remove instances that have been checked out
	userclickInstancesToBeRemovedFromTheStage := make(map[*models.UserClick]struct{})
	for key, value := range models.Stage.UserClicks {
		userclickInstancesToBeRemovedFromTheStage[key] = value
	}

	// copy orm objects to the the map
	for _, userclickDB := range userclickDBArray {
		backRepoUserClick.CheckoutPhaseOneInstance(&userclickDB)

		// do not remove this instance from the stage, therefore
		// remove instance from the list of instances to be be removed from the stage
		userclick, ok := (*backRepoUserClick.Map_UserClickDBID_UserClickPtr)[userclickDB.ID]
		if ok {
			delete(userclickInstancesToBeRemovedFromTheStage, userclick)
		}
	}

	// remove from stage and back repo's 3 maps all userclicks that are not in the checkout
	for userclick := range userclickInstancesToBeRemovedFromTheStage {
		userclick.Unstage()

		// remove instance from the back repo 3 maps
		userclickID := (*backRepoUserClick.Map_UserClickPtr_UserClickDBID)[userclick]
		delete((*backRepoUserClick.Map_UserClickPtr_UserClickDBID), userclick)
		delete((*backRepoUserClick.Map_UserClickDBID_UserClickDB), userclickID)
		delete((*backRepoUserClick.Map_UserClickDBID_UserClickPtr), userclickID)
	}

	return
}

// CheckoutPhaseOneInstance takes a userclickDB that has been found in the DB, updates the backRepo and stages the
// models version of the userclickDB
func (backRepoUserClick *BackRepoUserClickStruct) CheckoutPhaseOneInstance(userclickDB *UserClickDB) (Error error) {

	userclick, ok := (*backRepoUserClick.Map_UserClickDBID_UserClickPtr)[userclickDB.ID]
	if !ok {
		userclick = new(models.UserClick)

		(*backRepoUserClick.Map_UserClickDBID_UserClickPtr)[userclickDB.ID] = userclick
		(*backRepoUserClick.Map_UserClickPtr_UserClickDBID)[userclick] = userclickDB.ID

		// append model store with the new element
		userclick.Name = userclickDB.Name_Data.String
		userclick.Stage()
	}
	userclickDB.CopyBasicFieldsToUserClick(userclick)

	// preserve pointer to userclickDB. Otherwise, pointer will is recycled and the map of pointers
	// Map_UserClickDBID_UserClickDB)[userclickDB hold variable pointers
	userclickDB_Data := *userclickDB
	preservedPtrToUserClick := &userclickDB_Data
	(*backRepoUserClick.Map_UserClickDBID_UserClickDB)[userclickDB.ID] = preservedPtrToUserClick

	return
}

// BackRepoUserClick.CheckoutPhaseTwo Checkouts all staged instances of UserClick to the BackRepo
// Phase Two is the update of instance with the field in the database
func (backRepoUserClick *BackRepoUserClickStruct) CheckoutPhaseTwo(backRepo *BackRepoStruct) (Error error) {

	// parse all DB instance and update all pointer fields of the translated models instance
	for _, userclickDB := range *backRepoUserClick.Map_UserClickDBID_UserClickDB {
		backRepoUserClick.CheckoutPhaseTwoInstance(backRepo, userclickDB)
	}
	return
}

// BackRepoUserClick.CheckoutPhaseTwoInstance Checkouts staged instances of UserClick to the BackRepo
// Phase Two is the update of instance with the field in the database
func (backRepoUserClick *BackRepoUserClickStruct) CheckoutPhaseTwoInstance(backRepo *BackRepoStruct, userclickDB *UserClickDB) (Error error) {

	userclick := (*backRepoUserClick.Map_UserClickDBID_UserClickPtr)[userclickDB.ID]
	_ = userclick // sometimes, there is no code generated. This lines voids the "unused variable" compilation error

	// insertion point for checkout of pointer encoding
	return
}

// CommitUserClick allows commit of a single userclick (if already staged)
func (backRepo *BackRepoStruct) CommitUserClick(userclick *models.UserClick) {
	backRepo.BackRepoUserClick.CommitPhaseOneInstance(userclick)
	if id, ok := (*backRepo.BackRepoUserClick.Map_UserClickPtr_UserClickDBID)[userclick]; ok {
		backRepo.BackRepoUserClick.CommitPhaseTwoInstance(backRepo, id, userclick)
	}
}

// CommitUserClick allows checkout of a single userclick (if already staged and with a BackRepo id)
func (backRepo *BackRepoStruct) CheckoutUserClick(userclick *models.UserClick) {
	// check if the userclick is staged
	if _, ok := (*backRepo.BackRepoUserClick.Map_UserClickPtr_UserClickDBID)[userclick]; ok {

		if id, ok := (*backRepo.BackRepoUserClick.Map_UserClickPtr_UserClickDBID)[userclick]; ok {
			var userclickDB UserClickDB
			userclickDB.ID = id

			if err := backRepo.BackRepoUserClick.db.First(&userclickDB, id).Error; err != nil {
				log.Panicln("CheckoutUserClick : Problem with getting object with id:", id)
			}
			backRepo.BackRepoUserClick.CheckoutPhaseOneInstance(&userclickDB)
			backRepo.BackRepoUserClick.CheckoutPhaseTwoInstance(backRepo, &userclickDB)
		}
	}
}

// CopyBasicFieldsFromUserClick
func (userclickDB *UserClickDB) CopyBasicFieldsFromUserClick(userclick *models.UserClick) {
	// insertion point for fields commit

	userclickDB.Name_Data.String = userclick.Name
	userclickDB.Name_Data.Valid = true

	userclickDB.Lat_Data.Float64 = userclick.Lat
	userclickDB.Lat_Data.Valid = true

	userclickDB.Lng_Data.Float64 = userclick.Lng
	userclickDB.Lng_Data.Valid = true

	userclickDB.TimeOfClick_Data.Time = userclick.TimeOfClick
	userclickDB.TimeOfClick_Data.Valid = true
}

// CopyBasicFieldsFromUserClickWOP
func (userclickDB *UserClickDB) CopyBasicFieldsFromUserClickWOP(userclick *UserClickWOP) {
	// insertion point for fields commit

	userclickDB.Name_Data.String = userclick.Name
	userclickDB.Name_Data.Valid = true

	userclickDB.Lat_Data.Float64 = userclick.Lat
	userclickDB.Lat_Data.Valid = true

	userclickDB.Lng_Data.Float64 = userclick.Lng
	userclickDB.Lng_Data.Valid = true

	userclickDB.TimeOfClick_Data.Time = userclick.TimeOfClick
	userclickDB.TimeOfClick_Data.Valid = true
}

// CopyBasicFieldsToUserClick
func (userclickDB *UserClickDB) CopyBasicFieldsToUserClick(userclick *models.UserClick) {
	// insertion point for checkout of basic fields (back repo to stage)
	userclick.Name = userclickDB.Name_Data.String
	userclick.Lat = userclickDB.Lat_Data.Float64
	userclick.Lng = userclickDB.Lng_Data.Float64
	userclick.TimeOfClick = userclickDB.TimeOfClick_Data.Time
}

// CopyBasicFieldsToUserClickWOP
func (userclickDB *UserClickDB) CopyBasicFieldsToUserClickWOP(userclick *UserClickWOP) {
	userclick.ID = int(userclickDB.ID)
	// insertion point for checkout of basic fields (back repo to stage)
	userclick.Name = userclickDB.Name_Data.String
	userclick.Lat = userclickDB.Lat_Data.Float64
	userclick.Lng = userclickDB.Lng_Data.Float64
	userclick.TimeOfClick = userclickDB.TimeOfClick_Data.Time
}

// Backup generates a json file from a slice of all UserClickDB instances in the backrepo
func (backRepoUserClick *BackRepoUserClickStruct) Backup(dirPath string) {

	filename := filepath.Join(dirPath, "UserClickDB.json")

	// organize the map into an array with increasing IDs, in order to have repoductible
	// backup file
	forBackup := make([]*UserClickDB, 0)
	for _, userclickDB := range *backRepoUserClick.Map_UserClickDBID_UserClickDB {
		forBackup = append(forBackup, userclickDB)
	}

	sort.Slice(forBackup[:], func(i, j int) bool {
		return forBackup[i].ID < forBackup[j].ID
	})

	file, err := json.MarshalIndent(forBackup, "", " ")

	if err != nil {
		log.Panic("Cannot json UserClick ", filename, " ", err.Error())
	}

	err = ioutil.WriteFile(filename, file, 0644)
	if err != nil {
		log.Panic("Cannot write the json UserClick file", err.Error())
	}
}

// Backup generates a json file from a slice of all UserClickDB instances in the backrepo
func (backRepoUserClick *BackRepoUserClickStruct) BackupXL(file *xlsx.File) {

	// organize the map into an array with increasing IDs, in order to have repoductible
	// backup file
	forBackup := make([]*UserClickDB, 0)
	for _, userclickDB := range *backRepoUserClick.Map_UserClickDBID_UserClickDB {
		forBackup = append(forBackup, userclickDB)
	}

	sort.Slice(forBackup[:], func(i, j int) bool {
		return forBackup[i].ID < forBackup[j].ID
	})

	sh, err := file.AddSheet("UserClick")
	if err != nil {
		log.Panic("Cannot add XL file", err.Error())
	}
	_ = sh

	row := sh.AddRow()
	row.WriteSlice(&UserClick_Fields, -1)
	for _, userclickDB := range forBackup {

		var userclickWOP UserClickWOP
		userclickDB.CopyBasicFieldsToUserClickWOP(&userclickWOP)

		row := sh.AddRow()
		row.WriteStruct(&userclickWOP, -1)
	}
}

// RestoreXL from the "UserClick" sheet all UserClickDB instances
func (backRepoUserClick *BackRepoUserClickStruct) RestoreXLPhaseOne(file *xlsx.File) {

	// resets the map
	BackRepoUserClickid_atBckpTime_newID = make(map[uint]uint)

	sh, ok := file.Sheet["UserClick"]
	_ = sh
	if !ok {
		log.Panic(errors.New("sheet not found"))
	}

	// log.Println("Max row is", sh.MaxRow)
	err := sh.ForEachRow(backRepoUserClick.rowVisitorUserClick)
	if err != nil {
		log.Panic("Err=", err)
	}
}

func (backRepoUserClick *BackRepoUserClickStruct) rowVisitorUserClick(row *xlsx.Row) error {

	log.Printf("row line %d\n", row.GetCoordinate())
	log.Println(row)

	// skip first line
	if row.GetCoordinate() > 0 {
		var userclickWOP UserClickWOP
		row.ReadStruct(&userclickWOP)

		// add the unmarshalled struct to the stage
		userclickDB := new(UserClickDB)
		userclickDB.CopyBasicFieldsFromUserClickWOP(&userclickWOP)

		userclickDB_ID_atBackupTime := userclickDB.ID
		userclickDB.ID = 0
		query := backRepoUserClick.db.Create(userclickDB)
		if query.Error != nil {
			log.Panic(query.Error)
		}
		(*backRepoUserClick.Map_UserClickDBID_UserClickDB)[userclickDB.ID] = userclickDB
		BackRepoUserClickid_atBckpTime_newID[userclickDB_ID_atBackupTime] = userclickDB.ID
	}
	return nil
}

// RestorePhaseOne read the file "UserClickDB.json" in dirPath that stores an array
// of UserClickDB and stores it in the database
// the map BackRepoUserClickid_atBckpTime_newID is updated accordingly
func (backRepoUserClick *BackRepoUserClickStruct) RestorePhaseOne(dirPath string) {

	// resets the map
	BackRepoUserClickid_atBckpTime_newID = make(map[uint]uint)

	filename := filepath.Join(dirPath, "UserClickDB.json")
	jsonFile, err := os.Open(filename)
	// if we os.Open returns an error then handle it
	if err != nil {
		log.Panic("Cannot restore/open the json UserClick file", filename, " ", err.Error())
	}

	// read our opened jsonFile as a byte array.
	byteValue, _ := ioutil.ReadAll(jsonFile)

	var forRestore []*UserClickDB

	err = json.Unmarshal(byteValue, &forRestore)

	// fill up Map_UserClickDBID_UserClickDB
	for _, userclickDB := range forRestore {

		userclickDB_ID_atBackupTime := userclickDB.ID
		userclickDB.ID = 0
		query := backRepoUserClick.db.Create(userclickDB)
		if query.Error != nil {
			log.Panic(query.Error)
		}
		(*backRepoUserClick.Map_UserClickDBID_UserClickDB)[userclickDB.ID] = userclickDB
		BackRepoUserClickid_atBckpTime_newID[userclickDB_ID_atBackupTime] = userclickDB.ID
	}

	if err != nil {
		log.Panic("Cannot restore/unmarshall json UserClick file", err.Error())
	}
}

// RestorePhaseTwo uses all map BackRepo<UserClick>id_atBckpTime_newID
// to compute new index
func (backRepoUserClick *BackRepoUserClickStruct) RestorePhaseTwo() {

	for _, userclickDB := range *backRepoUserClick.Map_UserClickDBID_UserClickDB {

		// next line of code is to avert unused variable compilation error
		_ = userclickDB

		// insertion point for reindexing pointers encoding
		// update databse with new index encoding
		query := backRepoUserClick.db.Model(userclickDB).Updates(*userclickDB)
		if query.Error != nil {
			log.Panic(query.Error)
		}
	}

}

// this field is used during the restauration process.
// it stores the ID at the backup time and is used for renumbering
var BackRepoUserClickid_atBckpTime_newID map[uint]uint