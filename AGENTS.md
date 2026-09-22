# Create Lomi plugin

Follow CONTRIBUTING.md. This repository owns only the generator and its four
templates. SDK and CLI are exact npm dependencies of generated author projects.
Do not import sibling repository sources or add workspace/file dependencies to
published templates. Preserve user files on failure and interruption. Test the
installed generator archive outside the repository. Native desktop qualification
is separate from generator, CLI and mocked runtime tests.
