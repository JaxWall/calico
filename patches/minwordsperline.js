// -----------------------------------
// minimum words per line
// -----------------------------------
// ensures that if a line would break (i.e. what happens when you hit enter in
// a text editor), it will always have more than one word on the second line.
//
// so if a line break was inserted || there
// this ensures that the two lines would become
//		so if a line break was
// 		inserted there
// just because it looks a little nicer, honestly. i mean, it doesn't matter,
// not really, but these sort of little aesthetic considerations are what
// set apart good developers from great ones
//
// not that i'm calling myself a great developer. you've seen how i code.
// also, this may not be compatible with inline HTML. like, custom classes and
// spans that are in the physical ink. i'm not sure how to neatly avoid that?
// please feel free to pull request this

var credits = {
	emoji: "📝",
	name: "Minimum words per line",
	author: "Elliot Herriman",
	version: "1.0",
	description: "Prevent lines from breaking in a way that only leaves one (or more) word(s) on the next line.",
	licences: {
		self: "2021",
	}
}

var options = {
	// the minimum number of words per line
	minwordsperline_length: 2,
};

var currentLength;
var rgx = getRegex(options.minwordsperline_length);

function getRegex(length)
{
	if (length > 0)
	{
		currentLength = length;
		return new RegExp("((([^ ]|<[^>]+>)+ ?){1," + length + "}$)");
	}
}

function applyMinLength(line)
{		
	// if there's any text that also includes a space
	if (line.text && line.text.trim().includes(" "))
	{
		// figure out how long we want to ensure the last line will be
		let length = event.detail.story.options.minwordsperline_length;
	
		// and if it's different to our previously recorded length,
		if (length != currentLength)
		{
			// we recreate our regex, and set the new currentLength
			rgx = getRegex(length);
		}

		// then finally we match the last X words and wrap it in a span
		// that won't break across lines
		line.text = line.text.replace(rgx, "<span style='white-space: nowrap'>$1</span>");
	}
}

Patches.add(function()
{
	// trigger this in response to us finding a text line,
	this.outerdiv.addEventListener("passage line", (event) =>
	{
		applyMinLength(event.detail.line);
	});

	// or a choice line
	this.outerdiv.addEventListener("passage choice", (event) =>
	{
		applyMinLength(event.detail.choice);
	});

}, options, credits);

export default {options: options, credits: credits};