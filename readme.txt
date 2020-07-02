=== Recipe Card Blocks PRO by WPZOOM ===
Tags: gutenberg, food recipe, blocks, recipe, card, food, directions, ingredients, recipe card
Requires at least: 5.0
Requires PHP: 5.6
Tested up to: 5.4
Stable tag: trunk
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Beautiful Recipe Card Blocks for Food Bloggers with Schema Markup (JSON-LD) for the new WordPress editor (Gutenberg)

== Description ==

> Did you find this plugin helpful? Please consider [leaving a 5-star review](https://wordpress.org/support/plugin/recipe-card-blocks-by-wpzoom/reviews/).

Beautiful Recipe Card Blocks for Food Bloggers with Schema Markup (JSON-LD) for the new WordPress editor (Gutenberg)

Inspired by our popular food blog theme [Foodica](https://www.wpzoom.com/themes/foodica/), **[Recipe Card Blocks by WPZOOM](https://www.wpzoom.com/plugins/recipe-card-blocks)** is our newest plugin that adds beautiful blocks to the new **Gutenberg editor** to help you create recipe cards easily in your posts.

= 📌 INCLUDED BLOCKS =

* **Recipe Card (with Schema Markup) - 🆕**
* **Recipe Details**
* **Ingredients**
* **Directions**
* **Nutrition Facts**


= 📌 WHAT'S NEW IN 2.1? =
* New Feature: Ingredients and Directions **Groups**: you can now organize in **sub-sections** ingredients and directions
* New Feature: **Bulk Add**. You can add ingredients and directions by inserting more entries at once.


= 📌 WHAT'S NEW IN 2.0? =
* New Block with **Schema Markup**: **Recipe Card Block (schema.org)**
* Now you can use a single block to create a recipe card. You don't have to add anymore blocks like Ingredients or Directions separately.
* **JSON-LD Schema Markup**
* **2 Styles**
* New Settings Page (Settings > WPZOOM Recipe Card)
* You can now add Images in the Directions


= 📌 Where I can view a Demo? =

You can view the Recipe Card Block live [here](http://demo.wpzoom.com/recipe-card-blocks/).

= 📌 Coming Soon in future updates... =

* Nutrition


= 🙌 CREDITS & THANKS =

*  *Big thanks to Danny Cooper and his project [Editor Blocks](https://editorblockswp.com/) for providing help in developing this plugin.*


= 🙌 FOLLOW US =

* 🐦 [Twitter](https://twitter.com/wpzoom)
* 📘 [Facebook](https://facebook.com/wpzoom)
* 🌄 [Instagram](https://instagram.com/wpzoom)


== Changelog ==

= 2.9.1
* Fixed issue with undefined index on print page
* Ingredients display in one column on print page

= 2.9.0
* 🆕 Added new design: Accent Color Header
* Added AMP support
* Added Block Alignment
* When changing block alignment, the Header content alignment is changed too
* Added Color Scheme panel in Block Settings
* Added option called "NoPin" in Settings which prevent any images on the page that aren’t related to the content or aren’t good for Pinterest
* Added improvements to Print and Pinterest icons, Use SVG instead of image
* Added support for Additional CSS on print page
* Added hook filter 'wpzoom_rcb_block_json_ld' to allow users to disable JSON-LD markup
* Some improvements to Food Labels in Block Settings, now you can select labels from checkbox list
* Fixed issue when ingredient amount number is converted to float number with ".00" at the end when adjust servings
* Fixed issue when gallery image isSelected and action to move step up/down is triggered
* Fixed issue "The behavior of unparenthesized expressions containing both '.' and '+'/'-'"

= 2.8.3
* Fixed issue with Jump to Recipe and Print Recipe that are showing up on homepage as part of the excerpt

= 2.8.2 =
* Added support for the new "Guided Recipes" in Structured Data
* Fixed issue with blocks not showing in archive pages and RSS feeds

= 2.8.1 =
* Fixed issue with redirect to 404 page when Print button is clicked
* Fixed issue with link on Facebook Call to Action

= 2.8.0 =
* Added Image Gallery & Image Lightbox features in Directions. Additional options can be found on the Settings page of the plugin.
* Printing functionality was re-written and works differently now. This ensures printing will work from all devices and browsers without any problems
* Multiple bug fixes and improvements

= 2.7.1 =
* Fixed issue with Block Settings
* Fixed issue with custom Serving Size unit for Nutrition Facts with Horizontal Layout

= 2.7.0 =
* Added Food Labels (Vegan, Gluten Free, Sugar Free, etc.)
* Added option to add custom Serving Size unit for Nutrition Facts
* Added "spoon(s)" unit to parsing ingredient unit

= 2.6.3 =
* Added Toggle option to set Resting Time field in custom details

= 2.6.2 =
* Added Facebook to Call To Action (view Recipe Card Settings -> Appearance)
* Added Resting Time value to Calculate Total Time
* Fixed issue that causes to display wrong data (default value) for details in Recipe Card on Front-End
* Fixed issue with undefined index isGroup

= 2.6.1 =
* Fixed issue with the ingredients amount & unit to be visible in Structured Data

= 2.6.0 =
* Added Instagram & Pinterest call to actions in the footer of the recipe card (see details in the Settings page)
* Added new detail: Total Time
* Multiple bug fixes & improvements

= 2.5.3 =
* Added support for more ingredients units in the Bulk Add
* Minor fixes in the responsive design

= 2.5.2 =
* Fixed Pinterest custom image size issue
* Fixed issue with multiple digits on adjustable servings
* Fixed issue with parsing ingredient name while typing
* Added button quantity increments for adjustable servings

= 2.5.1 =
* Minor bug fix with Pinterest Custom Image not saving

= 2.5.0 =
* Improvements to Ingredients: you can now specify amount and unit
* New: Adjustable Servings. You can enable this option in Block options > Recipe Card Details.
* Fixed a bug with Pinterest Custom Image
* Multiple bug fixes and improvements

= 2.4.0 =
* 🔥 Added Nutrition Block with two Layouts (Vertical / Horizontal)
* Added possibility to edit details labels from Block Settings, and also edit unit for Servings
* Added possibility to add additional custom details from Block Settings
* Added option to upload images for ingredients
* GDPR: Added Privacy Policy template for Settings -> Privacy page
* Added Reset Ratings action in Settings Page
* Added option to set default color for rating stars in Settings Page
* Added option to set Who can rate recipes (Only logged in or Everyone) in Settings Page
* Numerous changes and improvements
* Fixed issue with Database table for recipe ratings
* Fixed issue to not include video attribute in Schema Markup if it's not added to the block

= 2.3.2 =
* Fixed a bug with star ratings not working when JS files are combined

= 2.3.1 =
* Fixed a bug with Video Recipe schema markup
* Added preview to some options in the Settings page

= 2.3.0 =
* Initial release of the PRO version
* Added Video Recipe feature in the block
* Numerous changes and improvements; new admin menu
* Fixed a conflict with Tasty Pins plugin