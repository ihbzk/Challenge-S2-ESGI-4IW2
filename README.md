# Challenge S2 G19 - ESGI 4IW2

## Projet : ?

Description du projet

![Image de la plateforme](lien_vers_une_image_de_présentation)

## 🌐 Repository

Ce projet est hébergé sur GitHub à l'adresse suivante : [Lien vers le repository](https://github.com/ihbzk/Challenge-S2-ESGI-4IW2).

## 🌟 Fonctionnalités (à faire)

- **Authentification :**
  - Inscription avec confirmation par mail
  - Connexion et prévention de la connexion si le compte nʼest pas confirmé
  - Réinitialisation du mot de passe
  - Intégration des recommandations de la CNIL concernant la sécurité des mots de passe pour un site e-commerce
    - Mot de passe de 12 caractères minimum avec symboles, chiffres, lettres minuscules et majuscules
    - Temporisation dʼaccès au compte après trois tentatives infructueuses et notification par mail
    - Demande de renouvellement du mot de passe 60 jours après la création du compte ou date du dernier changement du mot de passe
    - Conservation des mots de passes hachés

- **Recherche produits :**
  - Recherche via entrée utilisateur
    - Sur un nom
    - Sur une description dʼun produit
    - Recherche dans lʼURL en tant que paramètre de recherche GET permettant le partage des termes de recherches (en plus des facettes)
  - Recherche facettée
    - Nom du produit
    - Catégorie du produit
    - Marque du produit
    - Prix avec minimum et maximum
    - Produit actuellement en promotion
    - Produit actuellement en stock
    - Facettes dans lʼURL en tant que paramètre de recherche GET permettant de le partage de la recherche (en plus des termes de recherche)

- **Gestion dʼalerte par mail (Visibilité de lʼensemble des alertes sur le compte client) :**
  - Sur des nouveau produit dʼune catégorie
  - Sur le restock dʼun produit
  - Sur les changements de prix
  - Pour lʼinscription à la newsletter
  - Pouvoir désactiver chacune des alertes mail selon les préférences dʼun utilisateur et les respecter

- **Panier avec système de réservation (5min)**

- **Intégration dʼune plateforme de paiement :**
  - Intégration dʼune API de paiement
    - Stripe
    - Paypal
  - Possibilité de création de liens de paiement uniques
  - Possibilité dʼeffectuer un remboursement (avec facture dʼavoir)

- **Intégration de la gestion de livraison (API La Poste) :**

- **Gestion des stocks :**
  - Alerte en fin de stock
  - Configuration des alertes (valeur absolue pour un produit)
  - Graphique dʼévolution des stocks au cours des derniers mois
 
- **Historique de commande :**
  - Demande de facturation
  - Demande de retour produit
  - Recherche
  - Commander à nouveau

- **Panel dʼadministration :**
  - Crud sur lʼensemble des resources
  - Dashboard avec datavisualisation (pas juste des KPI)
  - Dashboard personnalisable sous forme de widgets

- **“Suppressionˮ de compte:**
  - Trouver une solution pour conserver les données dʼun utilisateur en les rendant anonymes
  - Il doit être possible de se créer de nouveau un compte avec les mêmes informations données à lʼinscription (après une suppression), dans ce cas les anciennes informations ne doivent pas être accessible par lʼutilisateur (puisquʼelles sont anonymisées)
  - Intégration des directives liées à la RGPD suivant la suppression dʼun compte

- **... [autres fonctionnalités]**

## 🌟 Rôles utilisateurs

- **ROLE_USER : client classique**
- **ROLE_STORE_KEEPER : gestion des stocks**
- **ROLE_ADMIN : accès au panel admin**

## 🚀 Démarrage rapide

### Prérequis

- Docker
- ... [autres prérequis]

### Installation

1. Clonez ce dépôt (SSH) : git@github.com:ihbzk/Challenge-S2-ESGI-4IW2.git
2. Accédez au dossier du projet : cd back / cd front
3. Lancez les deux application (back & front) avec Docker : docker-compose up -d
4. ... [autres étapes d'installation si nécessaire]

## 📖 Documentation

Vous pouvez accéder à la documentation complète [ici](lien_vers_la_documentation).

## 🛠️ Collaborateurs

- **Ilyesse HAMCHERIF** - [@ihbzk](https://github.com/ihbzk)
- **Théo DAVIGNY** - [@Thivalaine](https://github.com/Thivalaine)
- **Victor DE DOMENICO** - [@Nirdeo](https://github.com/Nirdeo)
- **Stéphan GUEORGUIEFF** - [@StephanG2a](https://github.com/StephanG2a)

## 🔐 Commits Auto-signés

Tous les commits de ce repository ont été auto-signés pour garantir leur authenticité.

## 📄 Licence

Ce projet est sous licence [MIT](lien_vers_le_fichier_de_licence).

## 📞 Contact

- **Ilyesse HAMCHERIF** - hamcherif.ilyesse@gmail.com
- **Théo DAVIGNY** - theodavigny06@gmail.com
- **Victor DE DOMENICO** - victordedomenico.du60@gmail.com
- **Stéphan GUEORGUIEFF** - stephan.gueorguieff@gmail.com

Pour toute question ou retour d'information, n'hésitez pas à nous contacter.
