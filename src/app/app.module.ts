import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

//Setear localizacion española
import { LOCALE_ID } from '@angular/core';
import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
registerLocaleData(localeEs);


//Componentes
import { AppComponent } from './app.component';
import { SignupComponent } from './components/signup/signup.component';

//Modulos
import { HttpClientModule } from "@angular/common/http";
import { ReactiveFormsModule } from "@angular/forms";
import { FormsModule } from "@angular/forms"; //Necesario para Angular Material
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//Modulos Angular material
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import { MatSelectModule } from "@angular/material/select";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatRadioModule, MAT_RADIO_DEFAULT_OPTIONS } from "@angular/material/radio";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatCardModule } from "@angular/material/card";

//Pipes
import { FirstPipe } from './pipes/first.pipe';



@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    FirstPipe
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    MatGridListModule,
    MatRadioModule,
    MatCheckboxModule,
    MatCardModule
  ],
  providers: [    
    {
      provide: MAT_RADIO_DEFAULT_OPTIONS,
      useValue: { color: 'primary' }
    },
    {provide: LOCALE_ID, useValue: 'es'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
