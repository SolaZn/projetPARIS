Pouvoir drag and drop une ville sur la map
Puis avoir drag and drop des monuments dans cette map zoomée pour avoir accès à des infos !
-> Possibilité pour le voyageur d'ajouter des marqueurs sur la zone et d'enregistrer ses marqueurs dans
une base de données
-> petit backend full php pour storer les données utilisateurs (ou alors .htaccess ?)

----Features----
Connexion (une bdd/un formulaire) (formulaire en transparence au dessus de l'appli)
Finir le layout 
Passer le curseur d'un marker normal à un point (pour pouvoir le différencier des markers normaux)
Avoir un geojson avec une dizaine, vingtaine de points d'intérêts sur Paris (genre monuments, lieux (avec descriptions rapides pour popups)
Le drag and drop d'éléments (villes, etc...)
Liste de favoris...
Mettre le lieu actuel en favori (le lieu sur le marker)
Pouvoir cliquer sur un point d'intérêt et récupérer les informations via nominatim -> on pourrait ensuite afficher les caractéristiques du lieu dans le dashboard à gauche puis demander à l'utilisateur si il veut l'ajouter à ses favoris !
Chaque "demande de lieu" affiche un petit résumé du lieu dans une box 
-> nom du lieu, adresse, pays (et en dessous deux boutons d'action)
Deux boutons principaux pour ces actions sur le dashboard :
🔵  où suis-je ? (qui récupère les données de lieu correspondant à l'endroit défini au centre de la map)
⭐ ajouter aux favoris (qui récupère le lieu actif pour le storer dans une BDD) 