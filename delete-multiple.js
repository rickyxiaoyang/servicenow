/**
 * Background script
 * Deletes multiple stories
 */

var epicName = "IBFS General Pages - November 2021 Scan";
var storyGR = new GlideRecord("rm_story");
storyGR.addQuery("epic.name", epicName);
storyGR.query();

//#1
// storyGR.deleteMultiple();

//#2 delete individually
while(storyGR.next()){
    gs.print(storyGR.number);
    storyGR.deleteRecord();
}