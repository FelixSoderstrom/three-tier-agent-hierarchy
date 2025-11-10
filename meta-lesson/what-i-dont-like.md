# Feedback from DEV

## index.html

First impression: looks plain, dull and boring. Very crowded. I have to scroll to see everything. We want more modern, sleek and wow factor. 

Bad stuff:
    - stat-cards looks and acts clickable even though they arent
    - Glow effect/color change on border hover looks tacky
    - Fonts are boring
    - Interactive elements look 20 years old
    - nav-card (Build) does not fit at all, its way too...orange..
    - Primary header too small
    - Spacing doesnt make sense - what belongs to what? There are no batches/groups
    - nav-cards are enormous - all fours should fit on a single horzizontal line

Good stuff:
    - Slight icon-zoom on nav-card hover
    - Arrow appears on nav-card hover
    - Underline on hovering nav-cards go BEHIND font - nice touch

What I'm envisioning:
    - Landing page animation. Header and stat-cards first, nav-cards later.
    - Darker black background
    - Background animations
    - Fonts with a little bit more oumnph to them
    - Spacious design with lots of breathing room to prevent the feeling of crowdedness


## story.html

First impression: This spacing is better. I like that the nodes open up separate modals.
Color split works but the colors are bad. Needs to be darker. The amount of accents are good..

Bad stuff:
    - Font boring here aswell
    - node-circles are not aligned vertically with the timeline-track
    - Header and subheader is all wrong. This isnt "Felixs story" it's the "Agents story"!
    - The modals contain too much text.
    - Modals look slightly different. There should be one uniform design between all modals where only the text changes.
    - The modal-tabs timeline is wrong. Some buttons are above others but they are not in order. We should have a sidebar instead where top is first (chronologically)

Good stuff:
    - The hover animation on the node-circles are nice!
    - I like the "Home / Story" section at the header for navigation - looks really good
    - Everything is more breathable here - spacing is good!
    - Files created and Lines of Code are nice stats. Although they should be at the top corner, always visible.

What I'm envisioning:
    - Similar timeline with breathable spacing
    - Centered nodes to the timeline-track
    - Darker design
    - More consice modals
    - Modals should include: 
        - Title of the epic (top)
        - Timeline sidebar from product manager -> team lead -> subagents (right side)
        - Short narrative from the agent (50-60 words, middle section)
        - To-Do list for the agent (right section)
        - x-button for closing the modal (top right corner)
        - Stats (below x-button)


## gallery.html

First impression: The most crowded page yet. Does not have the nice looking "Home / [current page]" in the header - this one is just "Back"
Search tool with filtering for 15 items? No thanks.. Remove the entire filter-section.
Workflow cards literally include ALL the information. The workflow-cards should provide quick peek at what it is and then on click open up a modal for more details.
Everything in the workflow-cards is valuable information, its just served instantly which makes it hard to digest.

Bad stuff:
    - No room to breathe - spacing is atrocious
    - search bar is not needed
    - gradient looks very tacky
    - color palette too bright
    - Hover animation on workflow-cards make them seem clickable, which they arent.

Good stuff:
    - Content of the workflow-cards are actually good, these make for good modals if they were wider and has better breathing room
    - Complexity icons look good - color really indicates what they are
    - Domain-tag also look good

What Im envisioning:
    - All workflow-cards have a simpler design that only contains: Title, complexity and domain-tag
    - All workflow cards are visible simulatneously in a 3x5 grid
    - clicking a workflow card opens up a modal that includes the rest of the information (basically the existing workflow card but wider and more space)
    - No search tool


## learn.html

First impression: This actually looks really good. Spacing is perfect for the type fo content that is being served.
The color/gradients are still a little tacky but this is a problem for all the pages weve seen so far.

Bad stuff:
    - Header titles boring
    - Another variation of the header.. This one says "Back to home" with an arrow (which is better than the one on gallery.html but worse than the one on story.html)
    - meta-agent example output: This isnt at all what the meta-agent would produce

Good stuff:
    - Great spacing for this type of content
    - toc-nav is great
        - Scrolling aniamtion when clicking is good
        - Highlight is good
        - Hovering should be slightly different from the selected one
    - The progress-bar as I scroll is spot on!
    - The back-to-top button is great!

What im envisioning:
    - Probably exatcly this to be honest but with a darker color scheme and better fonts


## builder.html

First impression: There is literally NO styling on this page - "Refused to apply styels from 'css/styles.css' because its MIME". I cant really say anything about the spacing, colors, fonts etc because its literally not even applied.
ANOTHER back-button for the header. This even links to the wrong landing page (links to "index.html" (the attention mechanism) - should link to "meta-lesson/index.html (building with agentic workflows)).
This leads me to believe that the styling was actually added to the other project. NOT GOOD!!
Alright, I changed the path to the styling document and can confirm its actually pointing to the attention mechanism lesson.


Bad stuff:
    - Cant really say anything about the styling. I see some colors and its the same tacky grey/orange - we need darker.
    - Continue button does nothing. I see "Continuing to next step" and "Current configuration: {epicCount: ....etc}" in the console when i press it.
    - I literally cannot give more feedback as the page is incomplete.
    - Emojis
    - Save Draft button does nothing either. It prints "State saved successfully" and "Draft saved" with a dictionary" Nothing was saved.
    - "Home" nav button in the header literally links to the other project
    - Unclickable elements look clickable (action-grid)
    - Header is atrocious

Good stuff:
    - Good step by step progress for the selections in the main screen
    - Timeline (step 1/3 is nice)

