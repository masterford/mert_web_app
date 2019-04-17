<!-- This is views/showAnimals.ejs -->

Hello, <%= username %>, nice to meet you.
<p>Here are the animals you like:
<ul>
<% faveAnimals.forEach( (animal) => { %>
   <li> <%= animal %> </li>
<% }); %>
</ul>
<a href='/public/form.html'>Back to form</a>
