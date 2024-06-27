
    document.addEventListener('DOMContentLoaded', function() {
        const headers = document.querySelectorAll('.accordion-header');
        headers.forEach(header => {
            header.addEventListener('click', function() {
                const content = this.nextElementSibling;
                if (content.style.display === 'block') {
                    content.style.display = 'none';
                } else {
                    document.querySelectorAll('.accordion-content').forEach(item => item.style.display = 'none');
                    content.style.display = 'block';
                }
            });
        });

        let chosenDoor = null;
        let winner = null;
        let revealedGoats = [];

        document.getElementById('door-form').addEventListener('submit', function(event) {
            event.preventDefault();
            const numDoors = document.getElementById('num_doors').value;
            fetch('/generate_doors', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `num_doors=${numDoors}`
            })
            .then(response => response.json())
            .then(data => {
                const doorsDiv = document.getElementById('doors');
                doorsDiv.innerHTML = '';
                chosenDoor = null;
                winner = data.winner;
                revealedGoats = [];
                document.getElementById('reveal-btn').style.display = 'none';
                for (let i = 0; i < data.num_doors; i++) {
                    const door = document.createElement('div');
                    door.className = 'door';
                    if (data.num_doors < 5) {
                        door.classList.add('large-door');
                    }
                    door.dataset.index = i;
                    door.textContent = i + 1;
                    door.addEventListener('click', () => selectDoor(i));
                    doorsDiv.appendChild(door);
                }
            });
        });

        document.getElementById('reveal-btn').addEventListener('click', function() {
            revealResult();
        });

        function selectDoor(index) {
            if (chosenDoor !== null) return;
            chosenDoor = index;
            document.querySelector(`.door[data-index='${index}']`).style.backgroundColor = 'green';

            fetch('/reveal_goat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chosen_door: chosenDoor, num_doors: document.getElementsByClassName('door').length, winner: winner })
            })
            .then(response => response.json())
            .then(data => {
                revealedGoats = data.revealed_goats;
                revealedGoats.forEach(goatIndex => {
                    const door = document.querySelector(`.door[data-index='${goatIndex}']`);
                    door.innerHTML = `<img src="static/goat.png" alt="Goat" class="goat">`;
                    door.style.backgroundColor = 'grey';
                });
                document.getElementById('reveal-btn').style.display = 'block';
            });
        }

        function revealResult() {
            const doors = document.getElementsByClassName('door');
            for (let door of doors) {
                const index = parseInt(door.dataset.index);
                if (index === winner) {
                    door.innerHTML = `<img src="static/prize.png" alt="Prize" class="prize">`;
                    door.style.backgroundColor = 'yellow';
                } else if (!revealedGoats.includes(index)) {
                    door.innerHTML = `<img src="static/goat.png" alt="Goat" class="goat">`;
                    door.style.backgroundColor = 'grey';
                }
                door.style.cursor = 'default';
                door.removeEventListener('click', selectDoor);
            }
        }

        let simulationChart = null;

        document.getElementById('simulation-form').addEventListener('submit', function(event) {
            event.preventDefault();
            const numDoors = document.getElementById('sim_num_doors').value;
            const numSimulations = document.getElementById('num_simulations').value;

            const theoreticalStayPercentage = (1 / numDoors) * 100;
            const theoreticalSwitchPercentage = 100 - theoreticalStayPercentage;


            fetch('/simulate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ num_doors: numDoors, num_simulations: numSimulations })
            })
            .then(response => response.json())
            .then(data => {
                const ctx = document.getElementById('simulationChart').getContext('2d');
                const simulationResults = document.getElementById('simulationResults');
                simulationResults.innerHTML = `
                    <table style=" text-align: center;">
                        <thead>
                            <tr style="padding: 0;">
                                <th style="padding: 10px;">Action</th>
                                <th style="padding: 10px;">Theoretical Win % </th>
                                <th style="padding: 10px;">Simulated Win % </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style="padding: 0;">
                                <td style="padding: 0;">
                                   <p style="margin: 0;"><b>Stay</b></p>
                                </td>
                                <td style="padding: 0;">
                                   <p style="margin: 0;"> ${theoreticalStayPercentage.toFixed(2)}%</p>
                                </td>
                                <td style="padding: 0;">
                                   <p style="margin: 0;"> ${data.stay_percentage.toFixed(2)}%</p>
                                </td>

                            </tr>
                            <tr style="padding: 0;">
                                <td style="padding: 0;">
                                   <p style="margin: 0;"><b>Switch</b></p>
                                </td>
                                <td style="padding: 0;">
                                   <p style="margin: 0;"> ${theoreticalSwitchPercentage.toFixed(2)}%</p>
                                </td>
                                <td style="padding: 0;">
                                   <p style="margin: 0;"> ${data.switch_percentage.toFixed(2)}%</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                `;

                // Destroy the existing chart if it exists
                if (simulationChart) {
                    simulationChart.destroy();
                }

                // Create a new chart
                simulationChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: Array.from({ length: numSimulations }, (_, i) => i + 1),
                        datasets: [
                            {
                                label: 'Stay Win Percentage',
                                data: data.stay_percentages,
                                borderColor: 'green',
                                fill: false
                            },
                            {
                                label: 'Switch Win Percentage',
                                data: data.switch_percentages,
                                borderColor: 'brown',
                                fill: false
                            }
                        ]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true,
                                max: 100
                            }
                        }
                    }
                });
            });
        });

    });
