const count = document.querySelector('#bagCount');
const toast = document.querySelector('#toast');
let items = 0;

document.querySelectorAll('.add').forEach((button) => {
  button.addEventListener('click', () => {
    items += 1;
    count.textContent = items;
    toast.textContent = `${button.dataset.item} added to your bag.`;
    toast.classList.add('show');
    window.clearTimeout(window.toastTimer);
    window.toastTimer = window.setTimeout(() => toast.classList.remove('show'), 2200);
  });
});

document.querySelector('#bagButton').addEventListener('click', () => {
  toast.textContent = items ? `${items} item${items === 1 ? '' : 's'} in your bag — checkout can link to your ordering system.` : 'Your bag is ready when you are.';
  toast.classList.add('show');
  window.clearTimeout(window.toastTimer);
  window.toastTimer = window.setTimeout(() => toast.classList.remove('show'), 2600);
});

document.querySelector('#year').textContent = new Date().getFullYear();
