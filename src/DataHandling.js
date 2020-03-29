// src/DataHandling.js
import * as d3 from 'd3';
import _ from 'lodash';

const cleanIncome = (d) => ({
    countyName: d['Name'],
    USstate: d['State'],
    medianIncome: Number(d['Median Household Income']),
    lowerBound: Number(d['90% CI Lower Bound']),
    upperBound: Number(d['90% CI Upper Bound'])
});

const dateParse = d3.timeParse("%m/%d/%Y");

const cleanSalary = (d) => {
    if (!d['base salary'] || Number(d['base salary']) > 300000) {
        return null;
    }

    return {employer: d.employer,
            submit_date: dateParse(d['submit date']),
            start_date: dateParse(d['start date']),
            case_status: d['case status'],
            job_title: d['job title'],
            clean_job_title: d['job title'],
            base_salary: Number(d['base salary']),
            city: d['city'],
            USstate: d['state'],
            county: d['county'],
            countyID: d['countyID']
    };
}

const cleanUSStateName = (d) => ({
    code: d.code,
    id: Number(d.id),
    name: d.name
});

const cleanCounty = d => ({
    id: Number(d.id),
    name: name
});


export const loadAllData = (callback = _.noop) => {
  Promise.all([
      d3.json("data/us.json"),
      d3.csv("data/us-county-names-normalized.csv", cleanCounty),
      d3.csv("data/county-median-incomes.csv", cleanIncome),
      d3.csv("data/h1bs-2012-2016-shortened.csv", cleanSalary),
      d3.tsv("data/us-state-names.tsv", cleanUSStateName)
  ]).then(([us, countyNames, medianIncomes, techSalaries, USstateNames]) => {

  });
};