# Weak Assembly Compiler

Um projeto de estudo para compilar Assembly em 'binário'.

# **Descontinuado**
   - Falta de acessibilidade (e paciência)
   - Movido para projeto [web](https://github.com/Luis-Guerra-Ocarinna/Weak-Assembly-Compiler/tree/web)

### Contexto

O trabalho final da disciplina de arquitetura na faculdade é criar uma CPU simulada.
Este projeto existe para facilitar a escrita manual da ROM, compilando mnemônicos de Assembly em uma lista de binários fácil de acompanhar.

# Objetivos / Features

   * [x] Compilar mnemônicos de uma tabela predefinida em binário
   * [ ] Aceitar novos mnemônicos na tabela
   * [ ] Ler arquivo de planilha com os mnemônicos

# Uso

```console
$ ./weak-asm-compiler [ASM_PATH]
```
   *Sem argumento, compila o primeiro `.asm` encontrado na pasta atual*

   - Arquivo `bin.md` será gerado

***Usando em uma IDE (como Falcon)***
   - Escreva o Assembly no mesmo diretório do código fonte
   - Rode o programa

# Futuro

  * Otimizar
  * Utilizar métodos seguros para manipulação de string
  * Gerenciar memória

