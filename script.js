'use strict';

const $ = (selector) => document.querySelector(selector);

const $stats = $('.stats');
const $filters = $('.report__filters');

const formatDataAttribute = (attribute) => {
  if (attribute.split(' ').length > 1)
    return attribute.split(' ').join('-').toLowerCase();
  return attribute.toLowerCase();
};

const formatTimeframe = (timeframe) => {
  const timeframes = {
    daily: 'Day',
    weekly: 'Week',
    monthly: 'Month',
  };
  return timeframes[timeframe];
};

const displayCard = (container, data) => {
  const dataAttribute = formatDataAttribute(data.title);
  const markup = `
    <li class="card stat" data-title="${dataAttribute}">
      <div class="stat__data">
        <div class="stat__heading">
          <h3><a href="#">${data.title}</a></h3>
          <img src="./images/icon-ellipsis.svg" alt="" aria-hidden="true" />
        </div>
        <div class="stat__info">
          <p>${data.current}hrs</p>
          <small>
            Last ${formatTimeframe(data.timeframe)} - ${data.previous}hrs
          </small>
        </div>
      </div>
    </li>
  `;
  container.insertAdjacentHTML('beforeend', markup);
};

const filterData = (arr, filter = 'weekly') => {
  return arr.map((stat) => {
    return {
      title: stat.title,
      timeframe: filter,
      current: stat.timeframes[filter].current,
      previous: stat.timeframes[filter].previous,
    };
  });
};

const getData = async () => {
  try {
    const url = './data.json';
    const response = await fetch(url);
    const data = await response.json();

    const init = filterData(data);
    init.forEach((card) => displayCard($stats, card));

    $filters.addEventListener('click', (e) => {
      const click = e.target;

      if (!click.classList.contains('btn')) return;

      const filters = click
        .closest('.report__filters')
        .querySelectorAll('.btn');
      filters.forEach((filter) => filter.classList.remove('filter__active'));
      click.classList.add('filter__active');

      const filter = click.getAttribute('data-filter');
      const filteredData = filterData(data, filter);
      $stats.innerHTML = '';
      filteredData.forEach((card) => displayCard($stats, card));
    });
  } catch (error) {}
};

getData();
