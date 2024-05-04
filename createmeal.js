
        document.getElementById('addBtn').addEventListener('click', function() {
            var table = document.getElementById('mealsTable').getElementsByTagName('tbody')[0];
            var newRow = table.insertRow(-1); 
            var cellCount = table.rows[0].cells.length;
            var newRowId = 'mealRow' + (table.rows.length - 1); 

            newRow.id = newRowId;

            for (var i = 0; i < cellCount; i++) {
    var newCell = newRow.insertCell(i);
    if (i === 0) {
        newCell.innerHTML = '<select><option value="" selected disabled>Select</option><option value="vegan">Vegan</option><option value="vegetarian">Vegetarian</option><option value="halal">Halal</option><option value="kosher">Kosher</option><option value="gluten-free">Gluten-Free</option></select>';
    } else if (i > 0 && i < cellCount - 1) { 
        if (i === 1) { 
            newCell.innerHTML = '<select><option value="" selected disabled>Select</option><option value="chicken">Chicken</option><option value="beef">Beef</option><option value="fish">Fish</option><option value="tofu">Tofu</option></select>';
        } else if (i === 2) {
            newCell.innerHTML = '<select><option value="" selected disabled>Select</option><option value="rice">Rice</option><option value="pasta">Pasta</option><option value="potatoes">Potatoes</option><option value="quinoa">Quinoa</option></select>';
        } else if (i === 3) { 
            newCell.innerHTML = '<select><option value="" selected disabled>Select</option><option value="apple">Apple</option><option value="banana">Banana</option><option value="orange">Orange</option><option value="grapes">Grapes</option></select>';
        } else if (i === 4) { 
            newCell.innerHTML = '<select><option value="" selected disabled>Select</option><option value="water">Water</option><option value="juice">Juice</option><option value="soda">Soda</option><option value="tea">Tea</option></select>';
        } else if (i === 5) { 
            newCell.innerHTML = '<select><option value="" selected disabled>Select</option><option value="nuts">Nuts</option><option value="yogurt">Yogurt</option><option value="granola">Granola</option><option value="corn chips">Corn Chips</option></select>';
        }
    } else if (i === cellCount - 1) { 
        newCell.textContent = 'In Progress...';
        newCell.id = 'mealConfirmation' + (table.rows.length - 1);
    }
}


            alert('Meal added successfully!');
            if (table.rows.length > 2) { 
                var prevRowId = 'mealRow' + (table.rows.length - 2); 
                disableDropdowns(prevRowId);
            }
            document.getElementById('mealConfirmation' + (table.rows.length - 2)).textContent = 'Meal Added Successfully!'; 
        });

        function disableDropdowns(rowId) {
            var row = document.getElementById(rowId);
            var selects = row.getElementsByTagName('select');
            for (var i = 0; i < selects.length; i++) {
                selects[i].disabled = true;
            }
        }
