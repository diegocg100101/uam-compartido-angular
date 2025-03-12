import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { GrupoService } from '../../services/grupo.service';
import { Router } from '@angular/router';
import { GrupoModel } from '../../models/grupo-model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-grupos',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './grupos.component.html',
  styleUrl: './grupos.component.css'
})

export class GruposComponent {

  listaGrupos: any = {};
  listaOriginal: any = {};
  infoGrupo: any = {};
  list: any[] = [];
  horario: string[] = [];
  jsonHorario: any;
  idunidades: string[] = [];
  grupoCompartir: any = { unidad: { idunidad: null, nombre: '' } };
  edicion: any;
  isAdmin : boolean = false;

  formulario = new FormGroup({
    "clavegrupo": new FormControl(''),
    "uea": new FormControl(null),
    "unidad": new FormControl(null),
    "horariolist": new FormControl<string[]>([]),
    "profesor": new FormControl(null),
    "cupounidad": new FormControl(''),
    "salon": new FormControl(null)
  });

  formularioEditar = new FormGroup({
    "clavegrupo": new FormControl(''),
    "uea": new FormControl(null),
    "unidad": new FormControl(null),
    "horariolist": new FormControl<string[]>([]),
    "profesor": new FormControl(null),
    "cupounidad": new FormControl(''),
    "salon": new FormControl(null)
  });

  constructor(private grupoApi: GrupoService, private router: Router, private authService: AuthService) {
    this.formulario.get('unidad')?.valueChanges.subscribe(valor => {
      this.actualizarClaveUnidad(valor)
    })

    this.formulario.get('uea')?.valueChanges.subscribe(valor => {
      this.actualizarClaveUea(valor)
    })
  }

  actualizarClaveUnidad(unidad: any) {
    this.formulario.patchValue({ clavegrupo: unidad.nombre.substring(0, 3).toUpperCase() })
  }

  actualizarClaveUea(uea: any) {
    const valor = this.formulario.get('clavegrupo')?.value
    this.formulario.get('clavegrupo')?.setValue(valor + uea.clave.substring(4) + this.quitarAcentos(uea.nombre.substring(0, 3).toUpperCase()) + Math.floor(Math.random() * 100))
  }

  limpiar() {
    this.formulario.reset()
  }

  ngOnInit() {

    this.grupoApi.getGrupoInformation().subscribe((data) => {
      this.infoGrupo = data

      this.infoGrupo.usuarios = this.infoGrupo.usuarios.map((usuario: any) => ({
        "noeconomico": usuario.noeconomico,
        "email": usuario.email,
        "password": usuario.password,
        "rol": {
          "idrol": usuario.rol.idrol,
          "nombre": usuario.rol.nombre
        },
        "nombre": usuario.nombre,
        "apellidopaterno": usuario.apellidopaterno,
        "apellidomaterno": usuario.apellidomaterno,
        "unidad": {
          "idunidad": usuario.unidad.idunidad,
          "nombre": usuario.unidad.nombre
        },
        "departamento": {
          iddepartamento: usuario.departamento.iddepartamento,
          nombre: usuario.departamento.nombre
        },
        "division": {
          "iddivision": usuario.division.iddivision,
          "nombre": usuario.division.nombre
        }
      }))
    })



    this.grupoApi.getLisGrupos().subscribe((data) => {
      this.listaOriginal = data;
      this.listaGrupos.grupos = [...this.listaOriginal.grupos];
    })

    this.isAdmin = this.authService.isAdmin();
  }

  eliminar(clave: any) {
    this.grupoApi.deleteGrupo(clave).subscribe({
      next: (response) => {
        console.log("Petición Exitosa")
        this.ngOnInit();
      },
      error: (error) => {
        /* TODO */
        console.log("Error al hacer la petición")
      }
    })

  }

  enviar() {
    this.formulario.patchValue({ horariolist: this.horario })
    this.grupoApi.altaGrupo(this.formulario.value).subscribe({
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
    this.formularioEditar.patchValue({ horariolist: this.horario })
    const grupo = this.formularioEditar.value
    this.grupoApi.editGrupo(grupo).subscribe({
      next: (data) => {
        console.log("Petición exitosa");
        this.ngOnInit();
      },
      error: (err) => {
        console.log("Error al hacer la petición");
      },
    })

  }

  buscar(event: Event) {
    this.listaGrupos.grupos = [...this.listaOriginal.grupos]

    const elemento = event.target as HTMLInputElement;
    const textoBusqueda = elemento.value.toLowerCase();

    if (textoBusqueda != '') {
      this.listaGrupos.grupos = this.listaGrupos.grupos.filter((grupo: any) => {
        return grupo.clavegrupo.toLowerCase().includes(textoBusqueda)
          || grupo.unidad.nombre.toLowerCase().includes(textoBusqueda)
          || (grupo.profesor.nombre + ' ' + grupo.profesor.apellidopaterno + ' ' + grupo.profesor.apellidomaterno).toLowerCase().includes(textoBusqueda)
          || this.quitarAcentos(grupo.profesor.nombre + ' ' + grupo.profesor.apellidopaterno + ' ' + grupo.profesor.apellidomaterno).toLowerCase().includes(textoBusqueda);
      })
    }
  }

  quitarAcentos(texto: string): string {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  ponerInfo(grupo: any) {
    console.log(grupo)
    this.formularioEditar.patchValue({
      clavegrupo: grupo.clavegrupo,
      uea: this.infoGrupo.ueas.find((claveuea: any) => claveuea.clave === grupo.uea.clave),
      unidad: this.infoGrupo.unidades.find((unidad: any) => unidad.idunidad === grupo.unidad.idunidad),
      profesor: this.infoGrupo.usuarios.find((noeconomico: any) => noeconomico.noeconomico === grupo.profesor.noeconomico),
      cupounidad: grupo.cupounidad,
      salon: this.infoGrupo.salones.find((salon: any) => salon.idsalon === grupo.salon.idsalon)
    })
  }

  actualizarHorario(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const valor = checkbox.value;

    if (checkbox.checked) {
      this.horario.push(valor);
    } else {
      this.horario = this.horario.filter(item => item !== valor);
    }
  }

  ponerHorario(grupo: any) {
    this.jsonHorario = JSON.parse(grupo.horario)
  }

  seleccionar(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const valor = checkbox.value;

    if (checkbox.checked) {
      this.idunidades.push(valor)
    } else {
      this.idunidades = this.idunidades.filter(item => item !== valor)
    }
  }

  guardarGrupo(grupo: any) {
    this.grupoCompartir = grupo
  }

  compartir() {
    this.grupoApi.shareGrupo(this.grupoCompartir.clavegrupo, { idunidades: this.idunidades }).subscribe({
      next: (data) => {
        console.log(data)
        this.ngOnInit()
      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  activarEdicion(grupo: any) {
    this.edicion = grupo.clavegrupo
  }

  actualizarInscritos(grupo: any, event: Event) {
    const input = event.target as HTMLInputElement;
    const valor = parseInt(input.value);

    if (valor >= 0) {
      grupo.inscritos = valor
      grupo.profesor = this.infoGrupo.usuarios.find((noeconomico: any) => noeconomico.noeconomico === grupo.profesor.noeconomico)
      console.log(grupo)
      this.grupoApi.editGrupo(grupo).subscribe({
        next: (data) => {
          console.log("Petición exitosa");
          this.edicion = ''
          this.ngOnInit();
        },
        error: (err) => {
          console.log("Error al hacer la petición");
        },
      })
    }
  }

  convertirUsuarios(grupo: any) {

  }
}
