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

	"github.com/thomaspeugeot/gongtenk/go/models"
)

// dummy variable to have the import declaration wihthout compile failure (even if no code needing this import is generated)
var dummy_Country_sql sql.NullBool
var dummy_Country_time time.Duration
var dummy_Country_sort sort.Float64Slice

// CountryAPI is the input in POST API
//
// for POST, API, one needs the fields of the model as well as the fields
// from associations ("Has One" and "Has Many") that are generated to
// fullfill the ORM requirements for associations
//
// swagger:model countryAPI
type CountryAPI struct {
	gorm.Model

	models.Country

	// encoding of pointers
	CountryPointersEnconding
}

// CountryPointersEnconding encodes pointers to Struct and
// reverse pointers of slice of poitners to Struct
type CountryPointersEnconding struct {
	// insertion for pointer fields encoding declaration
}

// CountryDB describes a country in the database
//
// It incorporates the GORM ID, basic fields from the model (because they can be serialized),
// the encoded version of pointers
//
// swagger:model countryDB
type CountryDB struct {
	gorm.Model

	// insertion for basic fields declaration

	// Declation for basic field countryDB.Name {{BasicKind}} (to be completed)
	Name_Data sql.NullString
	// encoding of pointers
	CountryPointersEnconding
}

// CountryDBs arrays countryDBs
// swagger:response countryDBsResponse
type CountryDBs []CountryDB

// CountryDBResponse provides response
// swagger:response countryDBResponse
type CountryDBResponse struct {
	CountryDB
}

// CountryWOP is a Country without pointers (WOP is an acronym for "Without Pointers")
// it holds the same basic fields but pointers are encoded into uint
type CountryWOP struct {
	ID int `xlsx:"0"`

	// insertion for WOP basic fields

	Name string `xlsx:"1"`
	// insertion for WOP pointer fields
}

var Country_Fields = []string{
	// insertion for WOP basic fields
	"ID",
	"Name",
}

type BackRepoCountryStruct struct {
	// stores CountryDB according to their gorm ID
	Map_CountryDBID_CountryDB *map[uint]*CountryDB

	// stores CountryDB ID according to Country address
	Map_CountryPtr_CountryDBID *map[*models.Country]uint

	// stores Country according to their gorm ID
	Map_CountryDBID_CountryPtr *map[uint]*models.Country

	db *gorm.DB
}

func (backRepoCountry *BackRepoCountryStruct) GetDB() *gorm.DB {
	return backRepoCountry.db
}

// GetCountryDBFromCountryPtr is a handy function to access the back repo instance from the stage instance
func (backRepoCountry *BackRepoCountryStruct) GetCountryDBFromCountryPtr(country *models.Country) (countryDB *CountryDB) {
	id := (*backRepoCountry.Map_CountryPtr_CountryDBID)[country]
	countryDB = (*backRepoCountry.Map_CountryDBID_CountryDB)[id]
	return
}

// BackRepoCountry.Init set up the BackRepo of the Country
func (backRepoCountry *BackRepoCountryStruct) Init(db *gorm.DB) (Error error) {

	if backRepoCountry.Map_CountryDBID_CountryPtr != nil {
		err := errors.New("In Init, backRepoCountry.Map_CountryDBID_CountryPtr should be nil")
		return err
	}

	if backRepoCountry.Map_CountryDBID_CountryDB != nil {
		err := errors.New("In Init, backRepoCountry.Map_CountryDBID_CountryDB should be nil")
		return err
	}

	if backRepoCountry.Map_CountryPtr_CountryDBID != nil {
		err := errors.New("In Init, backRepoCountry.Map_CountryPtr_CountryDBID should be nil")
		return err
	}

	tmp := make(map[uint]*models.Country, 0)
	backRepoCountry.Map_CountryDBID_CountryPtr = &tmp

	tmpDB := make(map[uint]*CountryDB, 0)
	backRepoCountry.Map_CountryDBID_CountryDB = &tmpDB

	tmpID := make(map[*models.Country]uint, 0)
	backRepoCountry.Map_CountryPtr_CountryDBID = &tmpID

	backRepoCountry.db = db
	return
}

// BackRepoCountry.CommitPhaseOne commits all staged instances of Country to the BackRepo
// Phase One is the creation of instance in the database if it is not yet done to get the unique ID for each staged instance
func (backRepoCountry *BackRepoCountryStruct) CommitPhaseOne(stage *models.StageStruct) (Error error) {

	for country := range stage.Countrys {
		backRepoCountry.CommitPhaseOneInstance(country)
	}

	// parse all backRepo instance and checks wether some instance have been unstaged
	// in this case, remove them from the back repo
	for id, country := range *backRepoCountry.Map_CountryDBID_CountryPtr {
		if _, ok := stage.Countrys[country]; !ok {
			backRepoCountry.CommitDeleteInstance(id)
		}
	}

	return
}

// BackRepoCountry.CommitDeleteInstance commits deletion of Country to the BackRepo
func (backRepoCountry *BackRepoCountryStruct) CommitDeleteInstance(id uint) (Error error) {

	country := (*backRepoCountry.Map_CountryDBID_CountryPtr)[id]

	// country is not staged anymore, remove countryDB
	countryDB := (*backRepoCountry.Map_CountryDBID_CountryDB)[id]
	query := backRepoCountry.db.Unscoped().Delete(&countryDB)
	if query.Error != nil {
		return query.Error
	}

	// update stores
	delete((*backRepoCountry.Map_CountryPtr_CountryDBID), country)
	delete((*backRepoCountry.Map_CountryDBID_CountryPtr), id)
	delete((*backRepoCountry.Map_CountryDBID_CountryDB), id)

	return
}

// BackRepoCountry.CommitPhaseOneInstance commits country staged instances of Country to the BackRepo
// Phase One is the creation of instance in the database if it is not yet done to get the unique ID for each staged instance
func (backRepoCountry *BackRepoCountryStruct) CommitPhaseOneInstance(country *models.Country) (Error error) {

	// check if the country is not commited yet
	if _, ok := (*backRepoCountry.Map_CountryPtr_CountryDBID)[country]; ok {
		return
	}

	// initiate country
	var countryDB CountryDB
	countryDB.CopyBasicFieldsFromCountry(country)

	query := backRepoCountry.db.Create(&countryDB)
	if query.Error != nil {
		return query.Error
	}

	// update stores
	(*backRepoCountry.Map_CountryPtr_CountryDBID)[country] = countryDB.ID
	(*backRepoCountry.Map_CountryDBID_CountryPtr)[countryDB.ID] = country
	(*backRepoCountry.Map_CountryDBID_CountryDB)[countryDB.ID] = &countryDB

	return
}

// BackRepoCountry.CommitPhaseTwo commits all staged instances of Country to the BackRepo
// Phase Two is the update of instance with the field in the database
func (backRepoCountry *BackRepoCountryStruct) CommitPhaseTwo(backRepo *BackRepoStruct) (Error error) {

	for idx, country := range *backRepoCountry.Map_CountryDBID_CountryPtr {
		backRepoCountry.CommitPhaseTwoInstance(backRepo, idx, country)
	}

	return
}

// BackRepoCountry.CommitPhaseTwoInstance commits {{structname }} of models.Country to the BackRepo
// Phase Two is the update of instance with the field in the database
func (backRepoCountry *BackRepoCountryStruct) CommitPhaseTwoInstance(backRepo *BackRepoStruct, idx uint, country *models.Country) (Error error) {

	// fetch matching countryDB
	if countryDB, ok := (*backRepoCountry.Map_CountryDBID_CountryDB)[idx]; ok {

		countryDB.CopyBasicFieldsFromCountry(country)

		// insertion point for translating pointers encodings into actual pointers
		query := backRepoCountry.db.Save(&countryDB)
		if query.Error != nil {
			return query.Error
		}

	} else {
		err := errors.New(
			fmt.Sprintf("Unkown Country intance %s", country.Name))
		return err
	}

	return
}

// BackRepoCountry.CheckoutPhaseOne Checkouts all BackRepo instances to the Stage
//
// Phase One will result in having instances on the stage aligned with the back repo
// pointers are not initialized yet (this is for pahse two)
//
func (backRepoCountry *BackRepoCountryStruct) CheckoutPhaseOne() (Error error) {

	countryDBArray := make([]CountryDB, 0)
	query := backRepoCountry.db.Find(&countryDBArray)
	if query.Error != nil {
		return query.Error
	}

	// list of instances to be removed
	// start from the initial map on the stage and remove instances that have been checked out
	countryInstancesToBeRemovedFromTheStage := make(map[*models.Country]struct{})
	for key, value := range models.Stage.Countrys {
		countryInstancesToBeRemovedFromTheStage[key] = value
	}

	// copy orm objects to the the map
	for _, countryDB := range countryDBArray {
		backRepoCountry.CheckoutPhaseOneInstance(&countryDB)

		// do not remove this instance from the stage, therefore
		// remove instance from the list of instances to be be removed from the stage
		country, ok := (*backRepoCountry.Map_CountryDBID_CountryPtr)[countryDB.ID]
		if ok {
			delete(countryInstancesToBeRemovedFromTheStage, country)
		}
	}

	// remove from stage and back repo's 3 maps all countrys that are not in the checkout
	for country := range countryInstancesToBeRemovedFromTheStage {
		country.Unstage()

		// remove instance from the back repo 3 maps
		countryID := (*backRepoCountry.Map_CountryPtr_CountryDBID)[country]
		delete((*backRepoCountry.Map_CountryPtr_CountryDBID), country)
		delete((*backRepoCountry.Map_CountryDBID_CountryDB), countryID)
		delete((*backRepoCountry.Map_CountryDBID_CountryPtr), countryID)
	}

	return
}

// CheckoutPhaseOneInstance takes a countryDB that has been found in the DB, updates the backRepo and stages the
// models version of the countryDB
func (backRepoCountry *BackRepoCountryStruct) CheckoutPhaseOneInstance(countryDB *CountryDB) (Error error) {

	country, ok := (*backRepoCountry.Map_CountryDBID_CountryPtr)[countryDB.ID]
	if !ok {
		country = new(models.Country)

		(*backRepoCountry.Map_CountryDBID_CountryPtr)[countryDB.ID] = country
		(*backRepoCountry.Map_CountryPtr_CountryDBID)[country] = countryDB.ID

		// append model store with the new element
		country.Name = countryDB.Name_Data.String
		country.Stage()
	}
	countryDB.CopyBasicFieldsToCountry(country)

	// preserve pointer to countryDB. Otherwise, pointer will is recycled and the map of pointers
	// Map_CountryDBID_CountryDB)[countryDB hold variable pointers
	countryDB_Data := *countryDB
	preservedPtrToCountry := &countryDB_Data
	(*backRepoCountry.Map_CountryDBID_CountryDB)[countryDB.ID] = preservedPtrToCountry

	return
}

// BackRepoCountry.CheckoutPhaseTwo Checkouts all staged instances of Country to the BackRepo
// Phase Two is the update of instance with the field in the database
func (backRepoCountry *BackRepoCountryStruct) CheckoutPhaseTwo(backRepo *BackRepoStruct) (Error error) {

	// parse all DB instance and update all pointer fields of the translated models instance
	for _, countryDB := range *backRepoCountry.Map_CountryDBID_CountryDB {
		backRepoCountry.CheckoutPhaseTwoInstance(backRepo, countryDB)
	}
	return
}

// BackRepoCountry.CheckoutPhaseTwoInstance Checkouts staged instances of Country to the BackRepo
// Phase Two is the update of instance with the field in the database
func (backRepoCountry *BackRepoCountryStruct) CheckoutPhaseTwoInstance(backRepo *BackRepoStruct, countryDB *CountryDB) (Error error) {

	country := (*backRepoCountry.Map_CountryDBID_CountryPtr)[countryDB.ID]
	_ = country // sometimes, there is no code generated. This lines voids the "unused variable" compilation error

	// insertion point for checkout of pointer encoding
	return
}

// CommitCountry allows commit of a single country (if already staged)
func (backRepo *BackRepoStruct) CommitCountry(country *models.Country) {
	backRepo.BackRepoCountry.CommitPhaseOneInstance(country)
	if id, ok := (*backRepo.BackRepoCountry.Map_CountryPtr_CountryDBID)[country]; ok {
		backRepo.BackRepoCountry.CommitPhaseTwoInstance(backRepo, id, country)
	}
}

// CommitCountry allows checkout of a single country (if already staged and with a BackRepo id)
func (backRepo *BackRepoStruct) CheckoutCountry(country *models.Country) {
	// check if the country is staged
	if _, ok := (*backRepo.BackRepoCountry.Map_CountryPtr_CountryDBID)[country]; ok {

		if id, ok := (*backRepo.BackRepoCountry.Map_CountryPtr_CountryDBID)[country]; ok {
			var countryDB CountryDB
			countryDB.ID = id

			if err := backRepo.BackRepoCountry.db.First(&countryDB, id).Error; err != nil {
				log.Panicln("CheckoutCountry : Problem with getting object with id:", id)
			}
			backRepo.BackRepoCountry.CheckoutPhaseOneInstance(&countryDB)
			backRepo.BackRepoCountry.CheckoutPhaseTwoInstance(backRepo, &countryDB)
		}
	}
}

// CopyBasicFieldsFromCountry
func (countryDB *CountryDB) CopyBasicFieldsFromCountry(country *models.Country) {
	// insertion point for fields commit

	countryDB.Name_Data.String = country.Name
	countryDB.Name_Data.Valid = true
}

// CopyBasicFieldsFromCountryWOP
func (countryDB *CountryDB) CopyBasicFieldsFromCountryWOP(country *CountryWOP) {
	// insertion point for fields commit

	countryDB.Name_Data.String = country.Name
	countryDB.Name_Data.Valid = true
}

// CopyBasicFieldsToCountry
func (countryDB *CountryDB) CopyBasicFieldsToCountry(country *models.Country) {
	// insertion point for checkout of basic fields (back repo to stage)
	country.Name = countryDB.Name_Data.String
}

// CopyBasicFieldsToCountryWOP
func (countryDB *CountryDB) CopyBasicFieldsToCountryWOP(country *CountryWOP) {
	country.ID = int(countryDB.ID)
	// insertion point for checkout of basic fields (back repo to stage)
	country.Name = countryDB.Name_Data.String
}

// Backup generates a json file from a slice of all CountryDB instances in the backrepo
func (backRepoCountry *BackRepoCountryStruct) Backup(dirPath string) {

	filename := filepath.Join(dirPath, "CountryDB.json")

	// organize the map into an array with increasing IDs, in order to have repoductible
	// backup file
	forBackup := make([]*CountryDB, 0)
	for _, countryDB := range *backRepoCountry.Map_CountryDBID_CountryDB {
		forBackup = append(forBackup, countryDB)
	}

	sort.Slice(forBackup[:], func(i, j int) bool {
		return forBackup[i].ID < forBackup[j].ID
	})

	file, err := json.MarshalIndent(forBackup, "", " ")

	if err != nil {
		log.Panic("Cannot json Country ", filename, " ", err.Error())
	}

	err = ioutil.WriteFile(filename, file, 0644)
	if err != nil {
		log.Panic("Cannot write the json Country file", err.Error())
	}
}

// Backup generates a json file from a slice of all CountryDB instances in the backrepo
func (backRepoCountry *BackRepoCountryStruct) BackupXL(file *xlsx.File) {

	// organize the map into an array with increasing IDs, in order to have repoductible
	// backup file
	forBackup := make([]*CountryDB, 0)
	for _, countryDB := range *backRepoCountry.Map_CountryDBID_CountryDB {
		forBackup = append(forBackup, countryDB)
	}

	sort.Slice(forBackup[:], func(i, j int) bool {
		return forBackup[i].ID < forBackup[j].ID
	})

	sh, err := file.AddSheet("Country")
	if err != nil {
		log.Panic("Cannot add XL file", err.Error())
	}
	_ = sh

	row := sh.AddRow()
	row.WriteSlice(&Country_Fields, -1)
	for _, countryDB := range forBackup {

		var countryWOP CountryWOP
		countryDB.CopyBasicFieldsToCountryWOP(&countryWOP)

		row := sh.AddRow()
		row.WriteStruct(&countryWOP, -1)
	}
}

// RestoreXL from the "Country" sheet all CountryDB instances
func (backRepoCountry *BackRepoCountryStruct) RestoreXLPhaseOne(file *xlsx.File) {

	// resets the map
	BackRepoCountryid_atBckpTime_newID = make(map[uint]uint)

	sh, ok := file.Sheet["Country"]
	_ = sh
	if !ok {
		log.Panic(errors.New("sheet not found"))
	}

	// log.Println("Max row is", sh.MaxRow)
	err := sh.ForEachRow(backRepoCountry.rowVisitorCountry)
	if err != nil {
		log.Panic("Err=", err)
	}
}

func (backRepoCountry *BackRepoCountryStruct) rowVisitorCountry(row *xlsx.Row) error {

	log.Printf("row line %d\n", row.GetCoordinate())
	log.Println(row)

	// skip first line
	if row.GetCoordinate() > 0 {
		var countryWOP CountryWOP
		row.ReadStruct(&countryWOP)

		// add the unmarshalled struct to the stage
		countryDB := new(CountryDB)
		countryDB.CopyBasicFieldsFromCountryWOP(&countryWOP)

		countryDB_ID_atBackupTime := countryDB.ID
		countryDB.ID = 0
		query := backRepoCountry.db.Create(countryDB)
		if query.Error != nil {
			log.Panic(query.Error)
		}
		(*backRepoCountry.Map_CountryDBID_CountryDB)[countryDB.ID] = countryDB
		BackRepoCountryid_atBckpTime_newID[countryDB_ID_atBackupTime] = countryDB.ID
	}
	return nil
}

// RestorePhaseOne read the file "CountryDB.json" in dirPath that stores an array
// of CountryDB and stores it in the database
// the map BackRepoCountryid_atBckpTime_newID is updated accordingly
func (backRepoCountry *BackRepoCountryStruct) RestorePhaseOne(dirPath string) {

	// resets the map
	BackRepoCountryid_atBckpTime_newID = make(map[uint]uint)

	filename := filepath.Join(dirPath, "CountryDB.json")
	jsonFile, err := os.Open(filename)
	// if we os.Open returns an error then handle it
	if err != nil {
		log.Panic("Cannot restore/open the json Country file", filename, " ", err.Error())
	}

	// read our opened jsonFile as a byte array.
	byteValue, _ := ioutil.ReadAll(jsonFile)

	var forRestore []*CountryDB

	err = json.Unmarshal(byteValue, &forRestore)

	// fill up Map_CountryDBID_CountryDB
	for _, countryDB := range forRestore {

		countryDB_ID_atBackupTime := countryDB.ID
		countryDB.ID = 0
		query := backRepoCountry.db.Create(countryDB)
		if query.Error != nil {
			log.Panic(query.Error)
		}
		(*backRepoCountry.Map_CountryDBID_CountryDB)[countryDB.ID] = countryDB
		BackRepoCountryid_atBckpTime_newID[countryDB_ID_atBackupTime] = countryDB.ID
	}

	if err != nil {
		log.Panic("Cannot restore/unmarshall json Country file", err.Error())
	}
}

// RestorePhaseTwo uses all map BackRepo<Country>id_atBckpTime_newID
// to compute new index
func (backRepoCountry *BackRepoCountryStruct) RestorePhaseTwo() {

	for _, countryDB := range *backRepoCountry.Map_CountryDBID_CountryDB {

		// next line of code is to avert unused variable compilation error
		_ = countryDB

		// insertion point for reindexing pointers encoding
		// update databse with new index encoding
		query := backRepoCountry.db.Model(countryDB).Updates(*countryDB)
		if query.Error != nil {
			log.Panic(query.Error)
		}
	}

}

// this field is used during the restauration process.
// it stores the ID at the backup time and is used for renumbering
var BackRepoCountryid_atBckpTime_newID map[uint]uint
