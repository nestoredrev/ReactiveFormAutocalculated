import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

interface validateError{
  [s:string]:boolean
}

@Injectable({
  providedIn: 'root'
})
export class ValidadoresService {

  constructor() { }


  checkUsuario(control: FormControl): Promise<validateError> | Observable<validateError>{

    return new Promise((resolve,reject) => {

      //Esto es una validacion asyncrona que podriamos realizar una peticion 
      //http previa para validar dicho campo
      setTimeout(() => {
        if(control.value === 'joker')
        {
          resolve({usuarioExiste:true})
        } 
        else
        {
          resolve(null);
        }       
      }, 3500);

    })
  }

  noHerrera( control: FormControl):validateError{
    
    //control.value?.toLowerCase() no funciona
    if(control.value)
    {
      if( control.value.toLowerCase() === 'herrera' ){
        return{
          noHerreraValidator: true
        }
      }
      else{
        return null;
      }
    }
  }

  passwordsIguales(pass1:string, pass2:string){
    //obtener los datos del formulario que queremos validar
    return (formGroup: FormGroup) => {
      const pass1Control = formGroup.controls[pass1];
      const pass2Control = formGroup.controls[pass2];
      
      if( pass1Control.value === pass2Control.value )
      {
        pass2Control.setErrors(null);
      }
      else
      {
        pass2Control.setErrors({noEsIgual:true});
      }
    }
  }

}
