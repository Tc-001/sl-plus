{ pkgs ? import <nixpkgs> {} }:

let

in pkgs.mkShell {
  packages = with pkgs; [
    nodejs_18
    # nodePackages.npm
		nodePackages.pnpm
		git
  ];

}