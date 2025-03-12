import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, FormsModule, Validators} from '@angular/forms';
import { UeaService } from '../../services/uea.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-ueas',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './ueas.component.html',
  styleUrl: './ueas.component.css'
})
export class UeasComponent {

  listaUea : any = {};
  listaOriginal : any = {};
  infoUea : any = {};
  list : any[] = []
  isAdmin : boolean = false;

  formulario = new FormGroup({
    "clave" : new FormControl('', Validators.compose([
      Validators.required
    ])),
    "nombre" : new FormControl('', Validators.compose([
      Validators.required,
      Validators.pattern("^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$")
    ])),
    "unidad" : new FormControl(null, Validators.compose([
      Validators.required
    ])),
    "tronco" : new FormControl(null, Validators.compose([
      Validators.required
    ])),
    "trimestre" : new FormControl(null, Validators.compose([
      Validators.required
    ])),
    "creditos" : new FormControl('', Validators.compose([
      Validators.required,
      Validators.max(100),
      Validators.min(1)
    ]))
  });

  formularioEditar = new FormGroup({
    "clave" : new FormControl('', Validators.compose([
      Validators.required
    ])),
    "nombre" : new FormControl('', Validators.compose([
      Validators.required,
      Validators.pattern("^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$")
    ])),
    "unidad" : new FormControl(null, Validators.compose([
      Validators.required
    ])),
    "tronco" : new FormControl(null, Validators.compose([
      Validators.required
    ])),
    "trimestre" : new FormControl(null, Validators.compose([
      Validators.required
    ])),
    "creditos" : new FormControl('', Validators.compose([
      Validators.required,
      Validators.max(100),
      Validators.min(1)
    ]))
  });

  constructor(private ueaApi : UeaService, private router : Router, private authService : AuthService) {}

  limpiar() {
    this.formulario.reset()
  }

  ngOnInit() {
    this.ueaApi.getUeaInformation().subscribe((data) => {
      this.infoUea = data;
    })

    this.ueaApi.getListUeas().subscribe((data) => {
      this.listaOriginal = data;
      this.listaUea.ueas = [...this.listaOriginal.ueas];
    })

    this.isAdmin = this.authService.isAdmin();
  }

  enviar() {
    console.log(this.formulario.value)
    this.ueaApi.altaUea(this.formulario.value).subscribe({
      next: (response) => {
        /* TODO */
        console.log("Petición exitosa");
        this.ngOnInit();
      },
      error: (error) => {
        /* TODO */
        console.log("Error al hacer la petición")
      }
    })
  }
  
  editar() {
    const uea = this.formularioEditar.value;
    
    // Hacer la petición
    this.ueaApi.editUea(uea).subscribe({
       next: (data) => {
         console.log("Petición exitosa");
         this.ngOnInit();
       },
       error: (err) => {
         console.log("Error al hacer la petición");
       },
     }) 
  }

  eliminar(clave : any) {
    this.ueaApi.deleteUea(clave).subscribe({
      next: (response) => {
        /* TODO */
        console.log(" Petición exitosa")
        this.ngOnInit();
      },
      error: (error) => {
        /* TODO */
        console.log("Error al hacer la petición")
      }
    })
  
  }

  ponerInfo(uea : any) {
    this.formularioEditar.patchValue({
      clave: uea.clave,
      nombre: uea.nombre,
      unidad: this.infoUea.unidades.find((unidad: any) => unidad.idunidad === uea.unidad.idunidad),
      tronco: this.infoUea.troncos.find((tronco: any) => tronco.idtronco === uea.tronco.idtronco),
      trimestre: this.infoUea.trimestres.find((trimestre: any) => trimestre.idtrimestre === uea.trimestre.idtrimestre),
      creditos: uea.creditos
    });
  }

  buscar(event : Event) {
    this.listaUea.ueas = [...this.listaOriginal.ueas];
    const elemento = event.target as HTMLInputElement
    const textoBusqueda = elemento.value.toLowerCase()

    if(textoBusqueda != '') {
      this.listaUea.ueas = this.listaUea.ueas.filter((uea : any) => {
        return this.quitarAcentos(uea.nombre.toLowerCase()).includes(textoBusqueda) 
        || uea.nombre.toLowerCase().includes(textoBusqueda)
        || uea.clave.toLowerCase().includes(textoBusqueda)
        || uea.unidad.nombre.toLowerCase().includes(textoBusqueda);
      }) 
    }  
  }

  quitarAcentos(texto : string) : string {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  get clave() {
    return this.formulario.get('clave');
  }

  get claveEditar() {
    return this.formularioEditar.get('clave');
  }

  get nombre() {
    return this.formulario.get('nombre');
  }

  get nombreEditar() {
    return this.formularioEditar.get('nombre');
  }

  get creditos() {
    return this.formulario.get('creditos');
  }

  get creditosEditar() {
    return this.formularioEditar.get('creditos');
  }

}
