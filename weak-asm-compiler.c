#include <ctype.h>
#include <glob.h>
#include <regex.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define ARRAY_LEN(x) (sizeof(x) / sizeof(*x))

const char *find_asm();
void compile(FILE *);
char *compile_line(char *);
char *compile_command(char *);

char *trim(char *);
void lower(char *);

const char *bin_path = "bin.md";

typedef struct {
  char *cmd;
  char *bin;
} command_t;

static command_t commands[] = {
    {"add r0,r1", "000 0000 0010 0000 0001"},
    {"not r0", "010 0000 0010 0000 0000"},
    {"nand r0,r1", "010 0000 0010 0000 0001"},
    {"sub r0,r1", "011 0000 0010 0000 0001"},
    {"shl r0,1", "001 0100 0010 0000 0000"},
    {"shr r0,1", "001 1000 0010 0000 0000"},
    {"mov r0,r1", "001 0000 0010 0000 1000"},
    {"mov r0,r2", "001 0000 0010 0001 0000"},
    {"mov r0,r3", "001 0000 0010 0001 1000"},
    {"mov r0,r4", "001 0000 0010 0010 0000"},
    {"mov r0,r5", "001 0000 0010 0010 1000"},
    {"mov r0,r6", "001 0000 0010 0011 0000"},
    {"mov r0,r7", "001 0000 0010 0011 1000"},
    {"mov r1,r0", "001 0000 0010 0100 0000"},
    {"mov r2,r0", "001 0000 0010 1000 0000"},
    {"mov r3,r0", "001 0000 0010 1100 0000"},
    {"mov r4,r0", "001 0000 0011 0000 0000"},
    {"mov r5,r0", "001 0000 0011 0100 0000"},
    {"mov r6,r0", "001 0000 0011 1000 0000"},
    {"mov r7,r0", "001 0000 0011 1100 0000"},
    {"mov mar,r0", "001 0010 0000 0000 0000"},
    {"mov r0,mbr", "101 0000 0010 0000 0000"},
    {"mov mbr,r0", "001 0001 0000 0000 0000"},
    {"in r0,r1", "001 0001 1000 0000 0000"},
    {"out r0,r1", "001 0000 0100 0000 0000"},
};

int main(int argc, char *argv[]) {
  char asm_path[256];
  stpcpy(asm_path, argc > 1 ? argv[1] : find_asm());

  FILE *asmfp = fopen(asm_path, "r");
  if (asmfp == NULL) {
    fprintf(stderr, "cannot open: %s\n", asm_path);
    exit(EXIT_FAILURE);
  }

  compile(asmfp);
  fclose(asmfp);

  return 0;
}

void compile(FILE *asmfp) {
  // read line by line of asm file
  char *line = NULL;
  size_t len = 0;

  // output file
  FILE *binfp = fopen(bin_path, "w");
  if (binfp == NULL) {
    fprintf(stderr, "cannot open: %s\n", bin_path);
    exit(EXIT_FAILURE);
  }

  while ((getline(&line, &len, asmfp) != -1))
    // compile the line and write it
    fprintf(binfp, "%s\n", compile_line(line));

  fclose(binfp);

  if (line)
    free(line);
}

char *compile_line(char *line) {
  char *cmd = trim(strtok(line, ";"));

  return compile_command(cmd);
}

char *compile_command(char *cmd) {
  if (strcmp(cmd, "") == 0)
    return "";

  for (int i = 0; i < ARRAY_LEN(commands); i++) {
    command_t *command = &commands[i];

    lower(cmd);
    if (strcmp(command->cmd, cmd) == 0)
      return command->bin;
  }

  return "";
}

// turn string into lower case
void lower(char *s) {
  for (; *s; ++s)
    *s = tolower(*s);
}

// remove leanding and trailing spaces
char *trim(char *str) {
  char *end;

  // Trim leanding
  while (isspace((unsigned char)*str))
    str++;

  if (*str == 0)
    return str; // all spaces

  // Trim trailing
  end = str + strlen(str) - 1;
  while (end > str && isspace((unsigned char)*end))
    end--;

  // write new null terminator character
  end[1] = '\0';

  return str;
}

const char *find_asm() {
  // try find the first *.asm in the dir
  char *r = malloc(256 * sizeof(char)); // used to free glob buffer

  glob_t glob_buf;

  glob("*.asm", 0, NULL, &glob_buf);

  if (glob_buf.gl_pathc <= 0)
    strcpy(r, "");

  strcpy(r, glob_buf.gl_pathv[0]);

  globfree(&glob_buf);
  return r;
}
