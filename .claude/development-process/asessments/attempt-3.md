# Attempt 3 - success

I have spent far too much time trying to make this happen but goddammit!
I wasn't goign to do this assignment properly!


## How it all came together

I changed some product-manager instructions to emphasize validation as a last step.
I also told PM (Opus) to implement last fixes by itself, maybe this saved my ass?

## The entire process

Can be divided into three sections:

### 1. Completing Epics

This was done with major changes to the epic definitions compard to attempt 1.
Main focus was with Making instructions clearer and solidifying examples between epics.
I added an agent hand-off system between epics that indicated full epic implementation.
I also isntructed team-leads to lead comments for other epics to follow.
Comprehensive testing were done for all instructions and I gave Sonnet 4 the epic isntructions and carefully analyzed its mock-epic implementation to later fine-tune instructions.


### 2. Post development testing

Testing was done inside the epic aswell, but to avoid biased team-leads who wanted a raise I chose to also add a test-step outside of the epic.
This was done by deploying an agent that read logfiles, epic definitions and relevant files to validate certain features were there.
This agent was deployed several times per epic to analyze the current state of the code base.
This Extra validation step found no missing features.


### 3. Simulated student

As a last step the product-manager was tasked with creating a subagent to mock a student taking the course.
The subagent was prompted with reading all documentation and then complete 3 tasks:
Install dependencies, Take the lesson and Run evaluation.
The agent encountered some critical issues along the way such as faulty isntallation script, false negatives in evaluation process but also provided good feedback for only having documentation in context such as clearer instructions, formatting issues etc.
These problems were then solved in the same step by the product-manager.

#### The (critical) issues encountered by simulated student

1. Setup script
Did not take into account a user might have multiple python interpreters, such as yours truly.
The project demanded version 3.10 but I had 3.13 as my default interpreter. This resulted in a PyTorch mismatch and dependency conflict.
The student solved this by creating the virtual environment manually.
The product-manager solved this bug by checking for multiple interpreters and also included a sysarg to the script for a path to python.

2. Evaluation process
Simulated student answered 100% correct in the notebook but still got 70% score.
This was a result of conflicting instructions meet overengineered code.
Infrastructure Epic created skeletons for a much more comprehensive evaluation system than I had intended. My original idea was to store the answers and compare them cell-by-cell one chat completion at a time with the LLM. My idea revolved around comparing code implementation to a template while the agents evaluation system wanted to process the entire thing at once and include stateful variables for the entire attention head.
Obviously the agents implementation is better. I guess I underestimated how much they could handle in that epic.
Simulated student saw this and reacted to the result.
Product-manager solved this by completely redesigning the entire evaluation process. Fortunately, much of the ground work was already done and the pm could do this with ease.


#### Threepeat

I then ran student simulation once more time manually for good measure and everything checked out.



## Final thoughts

This has been fun.
Im very sure that the project is not truly done. But I'm gonna call it quits here.
The simulated agent completed the course given only context from documentation - what more is there to day?
I will for sure have to clean up some of the file strutures, adjust styling and test the notebook myself. Even if I still might have some minor adjustments to make, I'm happy with how far this one (extremely complicated) prompt got me.