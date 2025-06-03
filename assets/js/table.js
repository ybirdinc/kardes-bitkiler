document.addEventListener('DOMContentLoaded', async function () {
  try {
    // JSON verisini çek
    const response = await fetch('assets/kardes_bitkiler.json');
    const data = await response.json();

    // Tüm bitki isimlerini al
    const plantNames = Object.keys(data);

    // Tabloyu oluştur
    const table = document.createElement('table');
    table.className = 'dataframe';

    // Başlık satırını oluştur
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    // İlk iki boş hücre
    headerRow.appendChild(document.createElement('th'));
    headerRow.appendChild(document.createElement('th'));

    // Bitki isimlerini başlık olarak ekle
    plantNames.forEach(name => {
      const th = document.createElement('th');
      th.textContent = name;
      headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Tablo gövdesini oluştur
    const tbody = document.createElement('tbody');

    // Her bitki için bir satır oluştur
    plantNames.forEach(plant1 => {
      const row = document.createElement('tr');

      // İlk sütuna bitki adı
      const firstCell = document.createElement('td');
      firstCell.textContent = plant1;
      row.appendChild(firstCell);

      // İkinci sütun boş
      row.appendChild(document.createElement('td'));

      // Diğer bitkilerle ilişkileri
      plantNames.forEach(plant2 => {
        const cell = document.createElement('td');

        if (data[plant1].favorable.includes(plant2)) {
          cell.textContent = 'X';
          cell.className = 'x';
        } else if (data[plant1].unfavorable.includes(plant2)) {
          cell.textContent = 'O';
          cell.className = 'o';
        }

        row.appendChild(cell);
      });

      tbody.appendChild(row);
    });

    table.appendChild(tbody);

    // Mevcut tabloyu yeni tablo ile değiştir
    const container = document.querySelector('table.dataframe');
    container.parentNode.replaceChild(table, container);

  } catch (error) {
    console.error('Veri yüklenirken hata oluştu:', error);
  }
});
