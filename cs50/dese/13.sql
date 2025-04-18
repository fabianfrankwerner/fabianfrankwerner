SELECT districts.name,
       expenditures.per_pupil_expenditure,
       AVG(graduation_rates.dropped) AS avg_dropout_rate
FROM districts
JOIN schools ON districts.id = schools.district_id
JOIN expenditures ON districts.id = expenditures.district_id
JOIN graduation_rates ON schools.id = graduation_rates.school_id
GROUP BY districts.id
ORDER BY expenditures.per_pupil_expenditure DESC
LIMIT 25;
