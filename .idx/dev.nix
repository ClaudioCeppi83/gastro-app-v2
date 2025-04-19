# To learn more about how to use Nix to configure your environment
# see: https://firebase.google.com/docs/studio/customize-workspace
{ pkgs, ... }: {
  # Which nixpkgs channel to use.
  channel = "stable-24.05"; # or "unstable"
  
  # Paquetes añadidos (conservando los comentarios existentes)
  packages = [
    # pkgs.go
    # pkgs.python311
    # pkgs.python311Packages.pip
    pkgs.nodejs_20  # Descomentado y necesario para Firebase
    # pkgs.nodePackages.nodemon
    pkgs.jdk17  # Java necesario para los emuladores
    pkgs.firebase-tools  # CLI de Firebase
  ];

  # Variables de entorno añadidas (manteniendo estructura vacía original)
  env = {
    JAVA_HOME = "${pkgs.jdk17}";
    FIRESTORE_EMULATOR_HOST = "localhost:8080";
    FIREBASE_AUTH_EMULATOR_HOST = "localhost:9099";
  };

  # Configuración IDX existente con pequeñas adiciones
  idx = {
    # Extensiones recomendadas para Firebase
    extensions = [
      # "vscodevim.vim"
      "firebase.firebase-vscode"  # Extensión oficial de Firebase
      "dbaeumer.vscode-eslint"    # Para linting
    ];

    # Previews manteniendo estructura original
    previews = {
      enable = true;
      previews = {
        # web = {
        #   command = ["npm" "run" "dev"];
        #   manager = "web";
        #   env = {
        #     PORT = "$PORT";
        #   };
        # };
        emulators = {
          command = ["firebase" "emulators:start"];
          manager = "terminal";
        };
      };
    };

    # Workspace hooks con añadidos para Firebase
    workspace = {
      onCreate = {
        npm-install = "npm install";
        # firebase-setup = "firebase setup:emulators:firestore";  # Commented out to avoid potential issues
        default.openFiles = [ ".idx/dev.nix" "README.md" ];
      };
      onStart = {
        # start-emulators = "firebase emulators:start";  # Commented out to avoid potential issues
      };
    };
  };
}
