import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";
import {CdkTextareaAutosize} from '@angular/cdk/text-field';
import { DataService } from 'src/app/services/data.service';
import { ValidadoresService } from 'src/app/services/validadores.service';



interface valoresSelected{
  nombre:string,
  valor:string,
  precio?: number
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {


  // Autoajuste para el textArea
  @ViewChild('autosize',{static:false}) autosize: CdkTextareaAutosize;

  formSignUp:FormGroup;


  totalActividades:number = 0;
  totalPackete:number = 0;
  precioTotal:number = 0;
  actividadesError:boolean = true;
  dataPaketes:any;
  
  //flags para las contraseñas
  hide:boolean = true;
  hideR:boolean = true;


  //Estructura de inicializacion del formulario
  dataFormSignUp:Object = {
    nombreCompleto: null,
    correo: null,
    telefono: null,
    nombreClub: null,
    alojamiento: 'si',
    tipoReserva: 'individual',
    numeroMiembros: 1,
    paquete: null,
    tipoAcompanante: null,
    acompanante: {
      nombre: null,
      telefono: null
    },
    actividades: [],
    observaciones: null,
    pass: null,
    passRepeat: null,
    condiciones: false
  }
  
  packetes:valoresSelected[] = [];

  acopaniantes:valoresSelected[] = [];

  actividadesData:valoresSelected[] = [];

  selectedActividadesValues:string[] = [];
  
  constructor(private dataServices : DataService,
              private formBuild: FormBuilder,
              private myValidators: ValidadoresService) {


                this.dataServices.getPacks().subscribe(data => {
                  console.log('Packetes:', data);
                  this.dataPaketes = data;
            
                  for (const key in data)
                  {
                    //devuelve un booleano indicando si el objeto tiene la propiedad especificada.
                    if (data.hasOwnProperty(key))
                    {
                      const element = data[key];

                      //opciones select packeetes
                      this.packetes.push({nombre:element.nombre,valor:element.id});
                      
                      //Obtener los datos del select de los acomñantes
                      if(key === 'pack1')
                      {
                        //Inicializar select de paquetes
                        this.formSignUp.get('paquete').setValue(element.id);
            
                        element.packs.forEach((elem,index) => {

                          //Inicializar select de acompanantes
                          if(index===0)
                          {
                            this.formSignUp.get('tipoAcompanante').setValue(elem.id);
                          }

                          this.acopaniantes.push({nombre:elem.packNombre,valor:elem.id});
                        });
                      }
            
                    }
                  }
            
                });
            
                this.dataServices.getActividades().subscribe(data => {
                  console.log('Actividades:', data);
                  for (const key in data)
                  {
                    if (data.hasOwnProperty(key))
                    {
                      const element = data[key];
                      this.actividadesData.push({nombre:element.nombre,valor:element.id,precio:element.precio});
                      this.actividades.push(this.formBuild.control(false,Validators.required));
                    }
                  }
                });
              }



  ngOnInit() {

    this.crearFormulario();

    this.inicializarFormulario();

    this.crearListeners();

  }


  crearFormulario(){
    this.formSignUp = this.formBuild.group({
      nombreCompleto: ['', Validators.required],
      correo: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$")]],
      telefono: ['', [Validators.required, Validators.pattern("[0-9]{9}$")]],
      nombreClub: ['', Validators.required],
      alojamiento: ['', Validators.required],
      tipoReserva: ['', Validators.required],
      numeroMiembros: ['', Validators.required],
      paquete: ['', Validators.required],
      tipoAcompanante: ['', Validators.required],
      acompanante: this.formBuild.group({
        nombre: ['', Validators.required],
        telefono: ['', [Validators.required, Validators.pattern("[0-9]{9}$")]],
      }),
      actividades: this.formBuild.array([]),
      observaciones: ['', [Validators.required, Validators.maxLength(256)]],
      pass: ['', [Validators.required, Validators.minLength(5)] ],
      passRepeat: [''],
      condiciones: [false, Validators.requiredTrue]
    },{
      validators: this.myValidators.passwordsIguales('pass', 'passRepeat')
    })
  }




  inicializarFormulario(){
    this.formSignUp.setValue(this.dataFormSignUp);
  }




  // getter para hacer referencia mas sensilla al formArray cuando se vaya utilizar(*ngFor) en la vista html
  get actividades(){
    return this.formSignUp.get('actividades') as FormArray;
  }




  getSelectedActividadesValues(){
    this.selectedActividadesValues = [];
    this.totalActividades = 0;
    this.actividades.controls.forEach((control, i) => {
      if(control.value)
      {
        this.selectedActividadesValues.push(this.actividadesData[i].valor);
      }
    });
    this.actividadesError = this.selectedActividadesValues.length > 0 ? false : true;
  }




  crearListeners(){

    this.formSignUp.valueChanges.subscribe(valor => {
      this.precioTotal = 0;
      this.calcularPrecioPaketes(valor);
      this.getPrecioActividades();


      if(valor.tipoReserva === 'individual')
      {

        if(valor.alojamiento === 'si')
        {
          this.precioTotal = this.totalPackete + this.totalActividades;
        }
        else if(valor.alojamiento === 'no')
        {
          this.totalPackete = 0;
          this.precioTotal = this.totalPackete + this.totalActividades;
        }
      }
      else if( valor.tipoReserva === 'multiple')
      {
        if(valor.alojamiento === 'si')
        {
          this.precioTotal = (this.totalPackete + this.totalActividades) * valor.numeroMiembros;
        }
        else if(valor.alojamiento === 'no')
        {
          this.totalPackete = 0;
          this.precioTotal = (this.totalPackete + this.totalActividades) * valor.numeroMiembros;
        }
      }
    });

    //Reiniciar el valor de los numeros de miembros y las actividades
    this.formSignUp.get('tipoReserva').valueChanges.subscribe( valor => {
      if(valor === 'individual')
      {
        this.resetActividades();
        this.formSignUp.get('numeroMiembros').setValue(1);
      }
      else
      {
        this.resetActividades();
      }
    });

    //Reiniciar las actividades cuando se cambia el tipo de alojamiento
    this.formSignUp.get('alojamiento').valueChanges.subscribe( valor => {
      this.resetActividades();
    });
  }




  calcularPrecioPaketes(data:any)
  {
    let paquete = data.paquete;
    let tipoAcompanante = data.tipoAcompanante;

    for (const key in this.dataPaketes)
    {
      if (this.dataPaketes.hasOwnProperty(key))
      {
        const element = this.dataPaketes[key];

        if(element.id === paquete)
        {
            return element.packs.find(pack => {
            if(pack.id === tipoAcompanante)
            {
              this.totalPackete = pack.precio;
            }
          });
        }
      }
    }
  }

  getPrecioActividades()
  {
    this.selectedActividadesValues = [];
    this.totalActividades = 0;
    this.actividades.controls.forEach((control, i) => {
      if(control.value)
      {
        this.totalActividades += this.actividadesData[i].precio;
      }
    });
  }

  resetActividades()
  {
    this.actividadesError = true;
    this.actividades.controls.forEach((control, i) => {
      this.actividades.controls[i].setValue(false);
    });
  }



  onSubmit()
  {
    console.log(this.formSignUp);
    const selectedActividades = this.selectedActividadesValues;
    const precioTotal = this.precioTotal;
    const data = {...this.formSignUp.value,selectedActividades,precioTotal}; 
    console.log(data);
  }

}
