---
layout: main.njk
title: FicusJS router documentation - Introduction
---
# Introduction

For multiple page applications, this simple client-side router is responsible for traversing a list of routes, finding the first matching route by string path, rendering any HTML returned from that route's action method into an outlet within the application.

**The router is a singleton - this ensures only one router instance exists as it controls page navigation.**
