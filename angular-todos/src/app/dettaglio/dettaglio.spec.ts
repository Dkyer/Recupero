// Importa gli strumenti di Angular per creare e testare i componenti
import { ComponentFixture, TestBed } from '@angular/core/testing';

// Importa il componente Dettaglio da testare
import { Dettaglio } from './dettaglio';

// describe: raggruppa tutti i test automatici del componente Dettaglio
describe('Dettaglio', () => {
  // Variabili per il componente e per il suo contenitore di test (fixture)
  let component: Dettaglio;
  let fixture: ComponentFixture<Dettaglio>;

  // beforeEach: viene eseguito prima di ogni test per preparare l'ambiente
  beforeEach(async () => {
    // Configura l'ambiente di test con il componente e compila HTML e CSS
    await TestBed.configureTestingModule({
      imports: [Dettaglio],
    }).compileComponents();

    // Crea una copia simulata del componente
    fixture = TestBed.createComponent(Dettaglio);
    // Prende l'istanza TypeScript del componente
    component = fixture.componentInstance;
    // Aspetta che eventuali operazioni asincrone iniziali siano finite
    await fixture.whenStable();
  });

  // it: definisce un singolo test ("deve essere creato")
  it('should create', () => {
    // expect(...).toBeTruthy(): verifica che il componente venga creato senza errori
    expect(component).toBeTruthy();
  });
});