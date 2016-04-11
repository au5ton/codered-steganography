# codered-steganography
CodeRED steganography project

## Purpose

While watching [NCIS (S5E3)](http://gfycat.com/LameCloudyHorsemouse), I had this nifty idea to learn more about Steganography. I've been wanting to do something like it ever since, so during CodeRED: Liftoff I proposed to make something like it.

##Description
Stego is a project by Austin Jackson, Matt Nyman, Arnaud Balma, and Ismael Almaguer that was made in 24 hours at CodeRED: Liftoff 2015. Steganography is a method of concealing data within other data. In our application, we use steganography with PNG images to hide text and entire files within them. We've also implemented optional, password-protected AES-256 encryption of the hidden data, to insure safety.

##Prerequisites
- Requires node.js and npm to be installed

##Installation and running
- Clone the repository: `git clone https://github.com/au5ton/codered-steganography.git`
- CD into the directory: `cd codered-steganography`
- Install the dependencies: `npm install`
- Run the server: `node webserver.js`
- Open the website: navigate to `localhost:3000` in your web browser
- You have the site running!

##How to use
- Take any PNG image (We've given you some files to mess around with in the [Test Files](https://github.com/au5ton/codered-steganography/releases/tag/v1.0) folder)
- Take any file under half the size of the PNG image
- Use the Encode section to hide your file in the PNG image (a password is optional, but you have to remember it!)
- After pressing the submit button, you will be redirected to your new PNG image which contains the file you hid in it. If it doesn't download, right-click and Save As.
- Congratulations! You've saved a file within another file, super low-key and awesome. Even better if you used a password and encrypted it.


- Now, what good is randomly encoding this data if I can't get it back?
- Navigate to the Decode section of the website. You'll have to go back to the homepage.
- In your Decode section, input *only* the PNG that you've encoded. Don't put the wrong one. In expected type, put the type of data you're expecting to get back from the decoding process. (If you encoded a file, select file, etc). If you encrypted your data with a password, now would be the time to input that same password.
Once you submit, you'll either be greated with a bad password error, or your hidden file will be downloaded through your browser.
