---
layout: main.njk
title: FicusJS router documentation - Modes
---
# Modes

There are two modes of routing available - `history` and `hash`. Modes are set using [options](/features/options).

## History routing

A router that uses the HTML5 history API (`pushState`, `replaceState` and the `popstate` event) to keep your UI in sync with the URL.

## Hash routing

A router that uses the hash portion of the URL (i.e. `window.location.hash`) to keep your UI in sync with the URL.
