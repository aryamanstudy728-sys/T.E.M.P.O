Extract this zip INTO your project folder so that the "engine" and "contract" folders merge with yours.
Say YES when Windows asks to replace baselines.py and optimise.py (they have small changes).

Then, from the engine folder:
  py -m pytest
  py make_sample.py

make_sample.py rewrites ..\contract\simulate.sample.json from YOUR engine's real output
(the one in this zip came from a test copy, so numbers may differ slightly).
