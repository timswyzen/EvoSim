# EvoSim
An evolution/natural selection simulator made by Pazda as a personal project to learn basic web dev/JS.

## Usage:
- The RGB bars on the left represent the genetic traits of your new creature
- Hit "Inject Specimen" to add your creature to the pool
- Hover over a creature (dot) to see its stats on the top right
- Given a mature male and female creature, they will attempt to reproduce with a fail chance related to its traits' favorability
- The RGB bars on the right represent favorable traits
  - A trait is neutral if it's in the center, favorable to the right, and unfavorable to the left
  - Creatures with unfavorable traits (weighted) will reproduce slower and perhaps even die off
  - Don't change the bars too fast or they might go extinct!
- Change the average age of death for the creatures using the text box (hit enter to confirm)
- 10x game speed may be slow on some systems, but natural selection does take a little while
- Mutations occur by up to 0.05% of a trait per generation
- Overpopulation may occur! If it does, reproduction has a high chance of failing.

## Try it here: https://timswyzen.github.io/EvoSim/

## TODO:
- Improve UI... substantially
- ~Tweak numbers~
  - ~Natural selection isn't strong enough, trends are not noticeable but must be balanced with not causing mass extinctions~
    - ~Killing off weak members helped but populations go extinct too easily~
  - ~Populations are not growing, just fluctuating around a certain point~
    - ~If they have at least 2 good traits they will overgrow which is good~
  - ~Possibly kill off unsuitable creatures to make natural selection actually work?~
- ~Add a generation counter~
- ~Add overpopulation control~
- ~Allow for custom reproduction & death rates as a ratio as well as game speed (within the UI)~
