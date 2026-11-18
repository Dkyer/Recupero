// Importa gli strumenti base di Angular: Component, OnInit (avvio), inject (dipendenze) e signal (dati reattivi)
import { Component, OnInit, inject, signal } from '@angular/core';
// Importa gli strumenti per leggere l'URL (ActivatedRoute), cambiare pagina (Router) e usare routerLink nell'HTML
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
// Importa il tipo di errore HTTP per gestire errori come 404 o rete assente (0)
import { HttpErrorResponse } from '@angular/common/http';
// Importa l'interfaccia Todo e il servizio TodoService
import { Todo } from '../modelli/todo';
import { TodoService } from '../services/todo-service';

// @Component: collega la logica TypeScript con il file HTML e CSS della pagina dettaglio
@Component({
  selector: 'app-dettaglio',
  imports: [RouterLink],
  templateUrl: './dettaglio.html',
  styleUrl: './dettaglio.css'
})
export class Dettaglio implements OnInit {
  // inject(): recupera i servizi necessari (rotta attuale, navigazione e servizio HTTP)
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly todoService = inject(TodoService);

  // signal(): variabili reattive che aggiornano automaticamente l'HTML quando cambia il loro valore
  readonly idCorrente = signal<number>(1);
  readonly todo = signal<Todo | null>(null);
  readonly loading = signal(false);
  readonly errore = signal<string | null>(null);

  // ngOnInit(): viene eseguito all'apertura del componente
  ngOnInit(): void {
    // paramMap.subscribe(): ascolta i cambi dell'id nell'URL (es. cliccando Precedente/Successivo)
    this.route.paramMap.subscribe((params) => {
      // Legge il parametro 'id' dall'URL e lo trasforma in numero
      const id = Number(params.get('id'));
      // Aggiorna il signal idCorrente con .set()
      this.idCorrente.set(id);
      // Chiama il metodo per scaricare i dati di quell'id
      this.caricaDettaglio(id);
    });
  }

  // Scarica il singolo elemento dal servizio tramite chiamata GET
  caricaDettaglio(id: number): void {
    // Attiva la rotella di caricamento e pulisce eventuali errori o dati precedenti
    this.loading.set(true);
    this.errore.set(null);
    this.todo.set(null);

    // .subscribe(): avvia la richiesta HTTP e resta in attesa della risposta
    this.todoService.getTodo(id).subscribe({
      // next: eseguito se la chiamata riesce; salva il dato e spegne il caricamento
      next: (dato) => {
        this.todo.set(dato);
        this.loading.set(false);
      },
      // error: eseguito se c'è un errore (404 o rete 0); salva il messaggio e spegne il caricamento
      error: (err: HttpErrorResponse) => {
        this.errore.set(this.todoService.messaggioErrore(err));
        this.loading.set(false);
      }
    });
  }

  // Se l'id è maggiore di 1, naviga all'URL /todos/(id - 1) senza ricaricare la pagina
  precedente(): void {
    if (this.idCorrente() > 1) {
      this.router.navigate(['/todos', this.idCorrente() - 1]);
    }
  }

  // Naviga all'URL /todos/(id + 1) senza ricaricare la pagina
  successivo(): void {
    this.router.navigate(['/todos', this.idCorrente() + 1]);
  }
}