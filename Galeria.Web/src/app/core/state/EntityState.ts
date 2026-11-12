import { signal, WritableSignal } from '@angular/core';

export abstract class CollectionState<T extends { guid?: string; id?: string | number }> {
  protected readonly items = signal<T[]>([]);

  private key(item: T): string {
    return String(item.guid ?? item.id ?? '');
  }

  criar(items: T[]) {
    this.items.set(items);
  }

  obter() {
    return this.items();
  }

  atualizar(item: T) {
    this.items.update((lista) => {
      const index = lista.findIndex((x) => this.key(x) === this.key(item));

      if (index === -1) {
        return [item, ...lista];
      }

      return lista.map((x) => (this.key(x) === this.key(item) ? item : x));
    });
  }

  excluir(id: string | number) {
    this.items.update((lista) => lista.filter((x) => this.key(x) !== String(id)));
  }

  limpar() {
    this.items.set([]);
  }
}
