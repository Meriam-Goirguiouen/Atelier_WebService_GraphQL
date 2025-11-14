# Atelier_WebService_GraphQL

Cette application est un gestionnaire de livres simple développé dans le cadre d'un atelier Spring Boot. Elle utilise **GraphQL** pour son API backend et une interface utilisateur construite avec Thymeleaf, Bootstrap 5 et JavaScript.

L'objectif de cet atelier est de démontrer l'intégration de GraphQL dans une application Spring Boot et de fournir une interface web interactive pour manipuler les données de livres (CRUD).

## Fonctionnalités

*   **Ajout de livres** : Créez de nouveaux enregistrements de livres.
*   **Affichage des livres** : Liste tous les livres disponibles.
*   **Recherche de livres** : Recherchez des livres par titre.
*   **Filtrage de livres** : Filtrez les livres par catégorie.
*   **Modification de livres** : Mettez à jour les informations des livres.
*   **Suppression de livres** : Supprimez des livres de la base de données (en mémoire).
*   **Console GraphQL interactive** : Testez directement les requêtes et mutations GraphQL depuis l'interface utilisateur.

## Technologies Utilisées

**Backend:**
*   **Spring Boot** (version 3.2.0)
*   **Spring GraphQL**
*   **Java 17**
*   **Données en mémoire** (Pas de base de données persistante pour cet atelier, les données sont réinitialisées au redémarrage de l'application)
