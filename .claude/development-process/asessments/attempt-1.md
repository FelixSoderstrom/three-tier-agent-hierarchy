# Assessing results of the framework

We have just finished our first attempt of fully automating the development process of this project.
Overall assessment, agents got 90% of the way which is really impressive.
I'm noting down what went right and wrong so that we can adjust our instructions to the team-leads and puch for the last 10%.


## What the team-leads got **wrong**

### *Epic 1* - Notebook Infrastructure

#### Missing

- Visualization cells after each code-cell in both lesson.ipynb and complete_lesson.ipynb.


#### Broken

- setup_venv.sh
    The agents never did 'chmod -x' on the script.
    Even after I did chmod manually it didnt work (it couldnt find my python version).
    Testing was obviously skipped in this step.


#### Improvements

- Create visualization-cells beneath each code-cell, effectively doubling the total amount of cells in the notebook.
- Include visualization cells in lesson.ipynb and not only complete_lesson.ipynb
- Make naming convention clear for end-variables used to pass into the visualization functions.
- Make it clear which cell the STUDENT should edit and which they should leave alone.
- Activate setup_venv.sh
- Validate that setup_venv.sh actually installs all dependencies

---

### *Epic 2* - Attention Implementation

#### Missing

#### Broken

#### Improvements needed

---

### *Epic 3* - Visualization

#### Missing

- Visualizations were interpreted to be integrated by the STUDENT in lesson.ipynb which is incorrect.


#### Broken

- Nothing inherently broken


#### Improvements

- Clear separation between visualization-cells and attention-cells needed in epic 1

---

### *Epic 4* - Evaluation Grading

#### Missing

- Cell-by-cell grading.
    The validation script finished very quickly. I doubt from previous experience with this exact model that inference ran 10 times, one chat completion for each cell.
- Expected feedback format.
    I got two json files in `/cache` with feedback on two cells (?).
    The current output format was not easy to understand and needs stricter definition.


#### Broken

- The grading system overall
    I ran the notebook with empty cells and then verify.py.
    I passed. This is obviously not good.
    This is probably a result of the two points mentioned above.


#### Improvements
- **Strict** format on evaluation output.
    We need a designated folder (created in epic 1) for evaluation output, preferably `grade/` or something else intuitive.
    We should also separate each execution of verify.py by directories and also each cell in the notebook by directories. Making the final structure look something like this:
        `grade/ATTEMPT_NUMBER/TOPIC.txt` This is feedback on individual cells. Only includes human readable feedback from the LLM.
        `grade/ATTEMPT_NUMBER/reciept.json` This is feedback for the entire notebook. Excludes LLM comments and only includes scores for a quick overview.
- Cell-by-cell evaluation.
    Each code-cell (filled out by the student) needs to be evaluated separately against the template (complete_lesson.ipynb).
    We should **NOT** run a single chat completion for grading the entire notebook on this smaller 8B parameter model!
    One chat completion per cell, comparing cells not by characters but functionality. The workflow is: Run inference (compare student cell with complete cell), write to file, repeat, finally create reciept.json with already available information.

---

### *Epic 5* - Mini Transformer Integration

Needs further assessing.
I ran the complete_notebook.inpynb and All I can tell is that those visualizations looked a little off. This could potentially be becaue of the small model.

---

### **Epic 6* - Web Interface Documantation

#### Missing
- Documentation integrated with HTML
    I expected MD files such as troubleshooting, configuration, install etc to be integrated with the website. Instead they are just scattered in root.
- No actual curriculum anywhere.
    We need to teach the students what they are about to do.
    This notebook is already completeable if the student already knows all of this. We need to provide a section in the website that actually teaches the students.
- Professional design in website.
    Current website uses too many flashy effects, contrastive colors. It looks like an ad for Toys R Us mildly put. This is normal when not giving Claude specific styling guidelines for frontend.

#### Broken

- Nothing inherently broken


#### Improvements
- Organize documentation
    Either include the MD files for config, setup etc in the website and create individual html pages explaining these things.
    Or just put the markdown files in a subdir instead of placing them all in root.
- Actually teach the student.
    This might even require its own epic to be honest.
    Gather relevant information on attention and transformers.
    Create a separate html page (learn.html perhaps) and just link to relevant courses/articles/videos etc.
    Needs a clear text stating I do **not** own this material and give credit where its due.
- Styling guidelines emphasising neutral, professional styling.
    Borderline Scandinavian minimalism.
    Color schema: Dark background elements, Orange for highlighting, white text, vauge effects and animation, no contrasting colors (purple/green is a bad look) sleek industrial looking.
