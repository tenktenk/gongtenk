// generated by genORMTranslation.go
package orm

import (
	"bufio"
	"bytes"
	"io/ioutil"
	"log"
	"os"
	"path/filepath"

	"gorm.io/gorm"

	"github.com/tenktenk/gongtenk/go/models"

	"github.com/tealeg/xlsx/v3"
)

// BackRepoStruct supports callback functions
type BackRepoStruct struct {
	// insertion point for per struct back repo declarations
	BackRepoCity BackRepoCityStruct

	BackRepoConfiguration BackRepoConfigurationStruct

	BackRepoCountry BackRepoCountryStruct

	BackRepoIndividual BackRepoIndividualStruct

	CommitNb uint // this ng is updated at the BackRepo level but also at the BackRepo<GongStruct> level

	PushFromFrontNb uint // records increments from push from front
}

func (backRepo *BackRepoStruct) GetLastCommitNb() uint {
	return backRepo.CommitNb
}

func (backRepo *BackRepoStruct) GetLastPushFromFrontNb() uint {
	return backRepo.PushFromFrontNb
}

func (backRepo *BackRepoStruct) IncrementCommitNb() uint {
	if models.Stage.OnInitCommitCallback != nil {
		models.Stage.OnInitCommitCallback.BeforeCommit(&models.Stage)
	}
	backRepo.CommitNb = backRepo.CommitNb + 1
	return backRepo.CommitNb
}

func (backRepo *BackRepoStruct) IncrementPushFromFrontNb() uint {
	backRepo.PushFromFrontNb = backRepo.PushFromFrontNb + 1
	return backRepo.CommitNb
}

// Init the BackRepoStruct inner variables and link to the database
func (backRepo *BackRepoStruct) init(db *gorm.DB) {
	// insertion point for per struct back repo declarations
	backRepo.BackRepoCity.Init(db)
	backRepo.BackRepoConfiguration.Init(db)
	backRepo.BackRepoCountry.Init(db)
	backRepo.BackRepoIndividual.Init(db)

	models.Stage.BackRepo = backRepo
}

// Commit the BackRepoStruct inner variables and link to the database
func (backRepo *BackRepoStruct) Commit(stage *models.StageStruct) {
	// insertion point for per struct back repo phase one commit
	backRepo.BackRepoCity.CommitPhaseOne(stage)
	backRepo.BackRepoConfiguration.CommitPhaseOne(stage)
	backRepo.BackRepoCountry.CommitPhaseOne(stage)
	backRepo.BackRepoIndividual.CommitPhaseOne(stage)

	// insertion point for per struct back repo phase two commit
	backRepo.BackRepoCity.CommitPhaseTwo(backRepo)
	backRepo.BackRepoConfiguration.CommitPhaseTwo(backRepo)
	backRepo.BackRepoCountry.CommitPhaseTwo(backRepo)
	backRepo.BackRepoIndividual.CommitPhaseTwo(backRepo)

	backRepo.IncrementCommitNb()
}

// Checkout the database into the stage
func (backRepo *BackRepoStruct) Checkout(stage *models.StageStruct) {
	// insertion point for per struct back repo phase one commit
	backRepo.BackRepoCity.CheckoutPhaseOne()
	backRepo.BackRepoConfiguration.CheckoutPhaseOne()
	backRepo.BackRepoCountry.CheckoutPhaseOne()
	backRepo.BackRepoIndividual.CheckoutPhaseOne()

	// insertion point for per struct back repo phase two commit
	backRepo.BackRepoCity.CheckoutPhaseTwo(backRepo)
	backRepo.BackRepoConfiguration.CheckoutPhaseTwo(backRepo)
	backRepo.BackRepoCountry.CheckoutPhaseTwo(backRepo)
	backRepo.BackRepoIndividual.CheckoutPhaseTwo(backRepo)
}

var BackRepo BackRepoStruct

func GetLastCommitNb() uint {
	return BackRepo.GetLastCommitNb()
}

func GetLastPushFromFrontNb() uint {
	return BackRepo.GetLastPushFromFrontNb()
}

// Backup the BackRepoStruct
func (backRepo *BackRepoStruct) Backup(stage *models.StageStruct, dirPath string) {
	os.MkdirAll(dirPath, os.ModePerm)

	// insertion point for per struct backup
	backRepo.BackRepoCity.Backup(dirPath)
	backRepo.BackRepoConfiguration.Backup(dirPath)
	backRepo.BackRepoCountry.Backup(dirPath)
	backRepo.BackRepoIndividual.Backup(dirPath)
}

// Backup in XL the BackRepoStruct
func (backRepo *BackRepoStruct) BackupXL(stage *models.StageStruct, dirPath string) {
	os.MkdirAll(dirPath, os.ModePerm)

	// open an existing file
	file := xlsx.NewFile()

	// insertion point for per struct backup
	backRepo.BackRepoCity.BackupXL(file)
	backRepo.BackRepoConfiguration.BackupXL(file)
	backRepo.BackRepoCountry.BackupXL(file)
	backRepo.BackRepoIndividual.BackupXL(file)

	var b bytes.Buffer
	writer := bufio.NewWriter(&b)
	file.Write(writer)
	theBytes := b.Bytes()

	filename := filepath.Join(dirPath, "bckp.xlsx")
	err := ioutil.WriteFile(filename, theBytes, 0644)
	if err != nil {
		log.Panic("Cannot write the XL file", err.Error())
	}
}

// Restore the database into the back repo
func (backRepo *BackRepoStruct) Restore(stage *models.StageStruct, dirPath string) {
	models.Stage.Commit()
	models.Stage.Reset()
	models.Stage.Checkout()

	//
	// restauration first phase (create DB instance with new IDs)
	//

	// insertion point for per struct backup
	backRepo.BackRepoCity.RestorePhaseOne(dirPath)
	backRepo.BackRepoConfiguration.RestorePhaseOne(dirPath)
	backRepo.BackRepoCountry.RestorePhaseOne(dirPath)
	backRepo.BackRepoIndividual.RestorePhaseOne(dirPath)

	//
	// restauration second phase (reindex pointers with the new ID)
	//

	// insertion point for per struct backup
	backRepo.BackRepoCity.RestorePhaseTwo()
	backRepo.BackRepoConfiguration.RestorePhaseTwo()
	backRepo.BackRepoCountry.RestorePhaseTwo()
	backRepo.BackRepoIndividual.RestorePhaseTwo()

	models.Stage.Checkout()
}

// Restore the database into the back repo
func (backRepo *BackRepoStruct) RestoreXL(stage *models.StageStruct, dirPath string) {

	// clean the stage
	models.Stage.Reset()

	// commit the cleaned stage
	models.Stage.Commit()

	// open an existing file
	filename := filepath.Join(dirPath, "bckp.xlsx")
	file, err := xlsx.OpenFile(filename)

	if err != nil {
		log.Panic("Cannot read the XL file", err.Error())
	}

	//
	// restauration first phase (create DB instance with new IDs)
	//

	// insertion point for per struct backup
	backRepo.BackRepoCity.RestoreXLPhaseOne(file)
	backRepo.BackRepoConfiguration.RestoreXLPhaseOne(file)
	backRepo.BackRepoCountry.RestoreXLPhaseOne(file)
	backRepo.BackRepoIndividual.RestoreXLPhaseOne(file)

	// commit the restored stage
	models.Stage.Commit()
}
