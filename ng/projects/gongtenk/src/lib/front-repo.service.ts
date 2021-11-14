import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, combineLatest, BehaviorSubject } from 'rxjs';

// insertion point sub template for services imports 
import { CityDB } from './city-db'
import { CityService } from './city.service'

import { ConfigurationDB } from './configuration-db'
import { ConfigurationService } from './configuration.service'

import { CountryDB } from './country-db'
import { CountryService } from './country.service'

import { IndividualDB } from './individual-db'
import { IndividualService } from './individual.service'


// FrontRepo stores all instances in a front repository (design pattern repository)
export class FrontRepo { // insertion point sub template 
  Citys_array = new Array<CityDB>(); // array of repo instances
  Citys = new Map<number, CityDB>(); // map of repo instances
  Citys_batch = new Map<number, CityDB>(); // same but only in last GET (for finding repo instances to delete)
  Configurations_array = new Array<ConfigurationDB>(); // array of repo instances
  Configurations = new Map<number, ConfigurationDB>(); // map of repo instances
  Configurations_batch = new Map<number, ConfigurationDB>(); // same but only in last GET (for finding repo instances to delete)
  Countrys_array = new Array<CountryDB>(); // array of repo instances
  Countrys = new Map<number, CountryDB>(); // map of repo instances
  Countrys_batch = new Map<number, CountryDB>(); // same but only in last GET (for finding repo instances to delete)
  Individuals_array = new Array<IndividualDB>(); // array of repo instances
  Individuals = new Map<number, IndividualDB>(); // map of repo instances
  Individuals_batch = new Map<number, IndividualDB>(); // same but only in last GET (for finding repo instances to delete)
}

//
// Store of all instances of the stack
//
export const FrontRepoSingloton = new (FrontRepo)

// the table component is called in different ways
//
// DISPLAY or ASSOCIATION MODE
//
// in ASSOCIATION MODE, it is invoked within a diaglo and a Dialog Data item is used to
// configure the component
// DialogData define the interface for information that is forwarded from the calling instance to 
// the select table
export class DialogData {
  ID: number = 0 // ID of the calling instance

  // the reverse pointer is the name of the generated field on the destination
  // struct of the ONE-MANY association
  ReversePointer: string = "" // field of {{Structname}} that serve as reverse pointer
  OrderingMode: boolean = false // if true, this is for ordering items

  // there are different selection mode : ONE_MANY or MANY_MANY
  SelectionMode: SelectionMode = SelectionMode.ONE_MANY_ASSOCIATION_MODE

  // used if SelectionMode is MANY_MANY_ASSOCIATION_MODE
  //
  // In Gong, a MANY-MANY association is implemented as a ONE-ZERO/ONE followed by a ONE_MANY association
  // 
  // in the MANY_MANY_ASSOCIATION_MODE case, we need also the Struct and the FieldName that are
  // at the end of the ONE-MANY association
  SourceStruct: string = ""  // The "Aclass"
  SourceField: string = "" // the "AnarrayofbUse"
  IntermediateStruct: string = "" // the "AclassBclassUse" 
  IntermediateStructField: string = "" // the "Bclass" as field
  NextAssociationStruct: string = "" // the "Bclass"
}

export enum SelectionMode {
  ONE_MANY_ASSOCIATION_MODE = "ONE_MANY_ASSOCIATION_MODE",
  MANY_MANY_ASSOCIATION_MODE = "MANY_MANY_ASSOCIATION_MODE",
}

//
// observable that fetch all elements of the stack and store them in the FrontRepo
//
@Injectable({
  providedIn: 'root'
})
export class FrontRepoService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient, // insertion point sub template 
    private cityService: CityService,
    private configurationService: ConfigurationService,
    private countryService: CountryService,
    private individualService: IndividualService,
  ) { }

  // postService provides a post function for each struct name
  postService(structName: string, instanceToBePosted: any) {
    let service = this[structName.toLowerCase() + "Service" + "Service" as keyof FrontRepoService]
    let servicePostFunction = service[("post" + structName) as keyof typeof service] as (instance: typeof instanceToBePosted) => Observable<typeof instanceToBePosted>

    servicePostFunction(instanceToBePosted).subscribe(
      instance => {
        let behaviorSubject = instanceToBePosted[(structName + "ServiceChanged") as keyof typeof instanceToBePosted] as unknown as BehaviorSubject<string>
        behaviorSubject.next("post")
      }
    );
  }

  // deleteService provides a delete function for each struct name
  deleteService(structName: string, instanceToBeDeleted: any) {
    let service = this[structName.toLowerCase() + "Service" as keyof FrontRepoService]
    let serviceDeleteFunction = service["delete" + structName as keyof typeof service] as (instance: typeof instanceToBeDeleted) => Observable<typeof instanceToBeDeleted>

    serviceDeleteFunction(instanceToBeDeleted).subscribe(
      instance => {
        let behaviorSubject = instanceToBeDeleted[(structName + "ServiceChanged") as keyof typeof instanceToBeDeleted] as unknown as BehaviorSubject<string>
        behaviorSubject.next("delete")
      }
    );
  }

  // typing of observable can be messy in typescript. Therefore, one force the type
  observableFrontRepo: [ // insertion point sub template 
    Observable<CityDB[]>,
    Observable<ConfigurationDB[]>,
    Observable<CountryDB[]>,
    Observable<IndividualDB[]>,
  ] = [ // insertion point sub template 
      this.cityService.getCitys(),
      this.configurationService.getConfigurations(),
      this.countryService.getCountrys(),
      this.individualService.getIndividuals(),
    ];

  //
  // pull performs a GET on all struct of the stack and redeem association pointers 
  //
  // This is an observable. Therefore, the control flow forks with
  // - pull() return immediatly the observable
  // - the observable observer, if it subscribe, is called when all GET calls are performs
  pull(): Observable<FrontRepo> {
    return new Observable<FrontRepo>(
      (observer) => {
        combineLatest(
          this.observableFrontRepo
        ).subscribe(
          ([ // insertion point sub template for declarations 
            citys_,
            configurations_,
            countrys_,
            individuals_,
          ]) => {
            // Typing can be messy with many items. Therefore, type casting is necessary here
            // insertion point sub template for type casting 
            var citys: CityDB[]
            citys = citys_ as CityDB[]
            var configurations: ConfigurationDB[]
            configurations = configurations_ as ConfigurationDB[]
            var countrys: CountryDB[]
            countrys = countrys_ as CountryDB[]
            var individuals: IndividualDB[]
            individuals = individuals_ as IndividualDB[]

            // 
            // First Step: init map of instances
            // insertion point sub template for init 
            // init the array
            FrontRepoSingloton.Citys_array = citys

            // clear the map that counts City in the GET
            FrontRepoSingloton.Citys_batch.clear()

            citys.forEach(
              city => {
                FrontRepoSingloton.Citys.set(city.ID, city)
                FrontRepoSingloton.Citys_batch.set(city.ID, city)
              }
            )

            // clear citys that are absent from the batch
            FrontRepoSingloton.Citys.forEach(
              city => {
                if (FrontRepoSingloton.Citys_batch.get(city.ID) == undefined) {
                  FrontRepoSingloton.Citys.delete(city.ID)
                }
              }
            )

            // sort Citys_array array
            FrontRepoSingloton.Citys_array.sort((t1, t2) => {
              if (t1.Name > t2.Name) {
                return 1;
              }
              if (t1.Name < t2.Name) {
                return -1;
              }
              return 0;
            });

            // init the array
            FrontRepoSingloton.Configurations_array = configurations

            // clear the map that counts Configuration in the GET
            FrontRepoSingloton.Configurations_batch.clear()

            configurations.forEach(
              configuration => {
                FrontRepoSingloton.Configurations.set(configuration.ID, configuration)
                FrontRepoSingloton.Configurations_batch.set(configuration.ID, configuration)
              }
            )

            // clear configurations that are absent from the batch
            FrontRepoSingloton.Configurations.forEach(
              configuration => {
                if (FrontRepoSingloton.Configurations_batch.get(configuration.ID) == undefined) {
                  FrontRepoSingloton.Configurations.delete(configuration.ID)
                }
              }
            )

            // sort Configurations_array array
            FrontRepoSingloton.Configurations_array.sort((t1, t2) => {
              if (t1.Name > t2.Name) {
                return 1;
              }
              if (t1.Name < t2.Name) {
                return -1;
              }
              return 0;
            });

            // init the array
            FrontRepoSingloton.Countrys_array = countrys

            // clear the map that counts Country in the GET
            FrontRepoSingloton.Countrys_batch.clear()

            countrys.forEach(
              country => {
                FrontRepoSingloton.Countrys.set(country.ID, country)
                FrontRepoSingloton.Countrys_batch.set(country.ID, country)
              }
            )

            // clear countrys that are absent from the batch
            FrontRepoSingloton.Countrys.forEach(
              country => {
                if (FrontRepoSingloton.Countrys_batch.get(country.ID) == undefined) {
                  FrontRepoSingloton.Countrys.delete(country.ID)
                }
              }
            )

            // sort Countrys_array array
            FrontRepoSingloton.Countrys_array.sort((t1, t2) => {
              if (t1.Name > t2.Name) {
                return 1;
              }
              if (t1.Name < t2.Name) {
                return -1;
              }
              return 0;
            });

            // init the array
            FrontRepoSingloton.Individuals_array = individuals

            // clear the map that counts Individual in the GET
            FrontRepoSingloton.Individuals_batch.clear()

            individuals.forEach(
              individual => {
                FrontRepoSingloton.Individuals.set(individual.ID, individual)
                FrontRepoSingloton.Individuals_batch.set(individual.ID, individual)
              }
            )

            // clear individuals that are absent from the batch
            FrontRepoSingloton.Individuals.forEach(
              individual => {
                if (FrontRepoSingloton.Individuals_batch.get(individual.ID) == undefined) {
                  FrontRepoSingloton.Individuals.delete(individual.ID)
                }
              }
            )

            // sort Individuals_array array
            FrontRepoSingloton.Individuals_array.sort((t1, t2) => {
              if (t1.Name > t2.Name) {
                return 1;
              }
              if (t1.Name < t2.Name) {
                return -1;
              }
              return 0;
            });


            // 
            // Second Step: redeem pointers between instances (thanks to maps in the First Step)
            // insertion point sub template for redeem 
            citys.forEach(
              city => {
                // insertion point sub sub template for ONE-/ZERO-ONE associations pointers redeeming
                // insertion point for pointer field Country redeeming
                {
                  let _country = FrontRepoSingloton.Countrys.get(city.CountryID.Int64)
                  if (_country) {
                    city.Country = _country
                  }
                }

                // insertion point for redeeming ONE-MANY associations
              }
            )
            configurations.forEach(
              configuration => {
                // insertion point sub sub template for ONE-/ZERO-ONE associations pointers redeeming

                // insertion point for redeeming ONE-MANY associations
              }
            )
            countrys.forEach(
              country => {
                // insertion point sub sub template for ONE-/ZERO-ONE associations pointers redeeming

                // insertion point for redeeming ONE-MANY associations
              }
            )
            individuals.forEach(
              individual => {
                // insertion point sub sub template for ONE-/ZERO-ONE associations pointers redeeming

                // insertion point for redeeming ONE-MANY associations
              }
            )

            // hand over control flow to observer
            observer.next(FrontRepoSingloton)
          }
        )
      }
    )
  }

  // insertion point for pull per struct 

  // CityPull performs a GET on City of the stack and redeem association pointers 
  CityPull(): Observable<FrontRepo> {
    return new Observable<FrontRepo>(
      (observer) => {
        combineLatest([
          this.cityService.getCitys()
        ]).subscribe(
          ([ // insertion point sub template 
            citys,
          ]) => {
            // init the array
            FrontRepoSingloton.Citys_array = citys

            // clear the map that counts City in the GET
            FrontRepoSingloton.Citys_batch.clear()

            // 
            // First Step: init map of instances
            // insertion point sub template 
            citys.forEach(
              city => {
                FrontRepoSingloton.Citys.set(city.ID, city)
                FrontRepoSingloton.Citys_batch.set(city.ID, city)

                // insertion point for redeeming ONE/ZERO-ONE associations
                // insertion point for pointer field Country redeeming
                {
                  let _country = FrontRepoSingloton.Countrys.get(city.CountryID.Int64)
                  if (_country) {
                    city.Country = _country
                  }
                }

                // insertion point for redeeming ONE-MANY associations
              }
            )

            // clear citys that are absent from the GET
            FrontRepoSingloton.Citys.forEach(
              city => {
                if (FrontRepoSingloton.Citys_batch.get(city.ID) == undefined) {
                  FrontRepoSingloton.Citys.delete(city.ID)
                }
              }
            )

            // 
            // Second Step: redeem pointers between instances (thanks to maps in the First Step)
            // insertion point sub template 

            // hand over control flow to observer
            observer.next(FrontRepoSingloton)
          }
        )
      }
    )
  }

  // ConfigurationPull performs a GET on Configuration of the stack and redeem association pointers 
  ConfigurationPull(): Observable<FrontRepo> {
    return new Observable<FrontRepo>(
      (observer) => {
        combineLatest([
          this.configurationService.getConfigurations()
        ]).subscribe(
          ([ // insertion point sub template 
            configurations,
          ]) => {
            // init the array
            FrontRepoSingloton.Configurations_array = configurations

            // clear the map that counts Configuration in the GET
            FrontRepoSingloton.Configurations_batch.clear()

            // 
            // First Step: init map of instances
            // insertion point sub template 
            configurations.forEach(
              configuration => {
                FrontRepoSingloton.Configurations.set(configuration.ID, configuration)
                FrontRepoSingloton.Configurations_batch.set(configuration.ID, configuration)

                // insertion point for redeeming ONE/ZERO-ONE associations

                // insertion point for redeeming ONE-MANY associations
              }
            )

            // clear configurations that are absent from the GET
            FrontRepoSingloton.Configurations.forEach(
              configuration => {
                if (FrontRepoSingloton.Configurations_batch.get(configuration.ID) == undefined) {
                  FrontRepoSingloton.Configurations.delete(configuration.ID)
                }
              }
            )

            // 
            // Second Step: redeem pointers between instances (thanks to maps in the First Step)
            // insertion point sub template 

            // hand over control flow to observer
            observer.next(FrontRepoSingloton)
          }
        )
      }
    )
  }

  // CountryPull performs a GET on Country of the stack and redeem association pointers 
  CountryPull(): Observable<FrontRepo> {
    return new Observable<FrontRepo>(
      (observer) => {
        combineLatest([
          this.countryService.getCountrys()
        ]).subscribe(
          ([ // insertion point sub template 
            countrys,
          ]) => {
            // init the array
            FrontRepoSingloton.Countrys_array = countrys

            // clear the map that counts Country in the GET
            FrontRepoSingloton.Countrys_batch.clear()

            // 
            // First Step: init map of instances
            // insertion point sub template 
            countrys.forEach(
              country => {
                FrontRepoSingloton.Countrys.set(country.ID, country)
                FrontRepoSingloton.Countrys_batch.set(country.ID, country)

                // insertion point for redeeming ONE/ZERO-ONE associations

                // insertion point for redeeming ONE-MANY associations
              }
            )

            // clear countrys that are absent from the GET
            FrontRepoSingloton.Countrys.forEach(
              country => {
                if (FrontRepoSingloton.Countrys_batch.get(country.ID) == undefined) {
                  FrontRepoSingloton.Countrys.delete(country.ID)
                }
              }
            )

            // 
            // Second Step: redeem pointers between instances (thanks to maps in the First Step)
            // insertion point sub template 

            // hand over control flow to observer
            observer.next(FrontRepoSingloton)
          }
        )
      }
    )
  }

  // IndividualPull performs a GET on Individual of the stack and redeem association pointers 
  IndividualPull(): Observable<FrontRepo> {
    return new Observable<FrontRepo>(
      (observer) => {
        combineLatest([
          this.individualService.getIndividuals()
        ]).subscribe(
          ([ // insertion point sub template 
            individuals,
          ]) => {
            // init the array
            FrontRepoSingloton.Individuals_array = individuals

            // clear the map that counts Individual in the GET
            FrontRepoSingloton.Individuals_batch.clear()

            // 
            // First Step: init map of instances
            // insertion point sub template 
            individuals.forEach(
              individual => {
                FrontRepoSingloton.Individuals.set(individual.ID, individual)
                FrontRepoSingloton.Individuals_batch.set(individual.ID, individual)

                // insertion point for redeeming ONE/ZERO-ONE associations

                // insertion point for redeeming ONE-MANY associations
              }
            )

            // clear individuals that are absent from the GET
            FrontRepoSingloton.Individuals.forEach(
              individual => {
                if (FrontRepoSingloton.Individuals_batch.get(individual.ID) == undefined) {
                  FrontRepoSingloton.Individuals.delete(individual.ID)
                }
              }
            )

            // 
            // Second Step: redeem pointers between instances (thanks to maps in the First Step)
            // insertion point sub template 

            // hand over control flow to observer
            observer.next(FrontRepoSingloton)
          }
        )
      }
    )
  }
}

// insertion point for get unique ID per struct 
export function getCityUniqueID(id: number): number {
  return 31 * id
}
export function getConfigurationUniqueID(id: number): number {
  return 37 * id
}
export function getCountryUniqueID(id: number): number {
  return 41 * id
}
export function getIndividualUniqueID(id: number): number {
  return 43 * id
}
