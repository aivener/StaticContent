try
{	
	function loadReviewers() {
		var usernames = window.usernamesByGroup[window.reviewerGroupName];

		var stashCurrentUsername = $('#current-user').attr('data-username');
		usernames = usernames.filter(n => n !== stashCurrentUsername);

		if (window.clearNames === true) {
			$('.select2-search-choice-close').each((i,e) => e.click());
		}
		else{
			$('.select2-search-choice .aui-avatar-xsmall').each((i, e) => {
				var name = $(e).attr('data-username');
				if(name){
					usernames = usernames.filter(n => n !== name);
				}
			});
		}

		var userIndex = 0;

		function trySelectUser(){
			var userToSelect = $(".select2-highlighted");
			if(userToSelect && userToSelect.length > 0){
				$(".select2-highlighted")[0].dispatchEvent(new Event("mouseup", {"bubbles": true}));

				console.log('Loaded ' + (userIndex + 1));

				setTimeout(function(){
					userIndex++;

					if(userIndex < usernames.length){
							$('#s2id_autogen1').sendkeys(usernames[userIndex]);
							trySelectUser();
					}
					else{
						console.log('Complete');
					}
				}, 250);
			}
			else{
					console.log('Loading...');
					if(!$('#s2id_autogen1').val()){
						if($('#s2id_autogen1').sendkeys === undefined){
							window.alert("Error loading code for key typing - please retry the bookmarklet after refreshing the page.")
						}
						else{
							$('#s2id_autogen1').sendkeys(usernames[userIndex]);
						}
					}
					setTimeout(trySelectUser, 500);
			}
		};

		$(document).ready(function(){
			console.log('Loading reviewers...');
			console.log(usernames[userIndex]);

			setTimeout(trySelectUser, 500);
		});
	};

	function loadDependencies(){
			console.log('Loading dependencies...');

			var jq = document.createElement('script');
			jq.src = "https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js";
			jq.onload = function() {
				var jq2 = document.createElement('script');
				jq2.src = "https://raw.githubusercontent.com/dwachss/bililiteRange/master/bililiteRange.js";
				jq2.onload = function () {
					var jq3 = document.createElement('script');
					jq3.src = "https://raw.githubusercontent.com/dwachss/bililiteRange/master/jquery.sendkeys.js";
					jq3.onload = function(){
						var usernamesFile = document.createElement('script');
						usernamesFile.src = "https://rawgit.com/rallen090/StaticContent/master/reviewer-groups.js";
						usernamesFile.onload = function(){
							if($ && $.fn.sendkeys && window.usernamesByGroup){
								setTimeout(loadReviewers, 500);
							}
							else{
								console.log('Not yet loaded');
								console.log($);
								console.log($.fn.sendkeys);
								setTimeout(loadDependencies, 500);
							}
						};
						document.getElementsByTagName('head')[0].appendChild(usernamesFile);
					};
					document.getElementsByTagName('head')[0].appendChild(jq3);
				};
				document.getElementsByTagName('head')[0].appendChild(jq2);
			};
			document.getElementsByTagName('head')[0].appendChild(jq);
			jQuery.noConflict();
	};

	if (typeof window.hasRunBefore === 'undefined') {
		window.clearNames = true;
		window.hasRunBefore = true;

		loadDependencies();
	}
	else{
		window.clearNames = false;
		loadReviewers();
	}
}
catch(ex)
{
	console.log(ex);
	window.prompt("Failed to load default reviewers :(\n\n Please reach out to Ryan Allen and provide the relevant error content shown below.", ex + " - " + ex.stack);
}
