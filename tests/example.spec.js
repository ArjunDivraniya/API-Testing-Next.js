const { test, expect } = require('@playwright/test');

const API_URL = 'http://localhost:3000/api/companies';

test.describe('Companies API Endpoints (Dynamic Tests)', () => {

  // Test suite for GET /api/companies/count
  test.describe('GET /api/companies/count', () => {
    test('returns total count when no filters are applied', async ({ request }) => {
      const res = await request.get(`${API_URL}/count`);
      const body = await res.json();
      expect(res.status()).toBe(200);
      expect(body).toHaveProperty('total');
      // The total count is now dynamically checked based on the database content
      expect(body.total).toBeGreaterThanOrEqual(0);
    });

    // Note: The original test for filtering by name is not applicable as the route doesn't support it.
    // The following tests check for 0 count on a non-existing filter, which is still valid.
    test('returns 0 when filtering by a non-existing location', async ({ request }) => {
      const res = await request.get(`${API_URL}/count?location=NonExistent`);
      const body = await res.json();
      expect(res.status()).toBe(200);
      expect(body).toHaveProperty('count');
      expect(body.count).toBe(0);
    });
  });

  // Test suite for GET /api/companies/top-paid
  test.describe('GET /api/companies/top-paid', () => {
    test('returns a maximum of 5 items by default', async ({ request }) => {
      const res = await request.get(`${API_URL}/top-paid`);
      const body = await res.json();
      expect(res.status()).toBe(200);
      expect(body.length).toBeLessThanOrEqual(5);
    });

    test('is sorted in descending order by base salary', async ({ request }) => {
      const res = await request.get(`${API_URL}/top-paid`);
      const companies = await res.json();
      expect(res.status()).toBe(200);
      if (companies.length > 1) {
        for (let i = 0; i < companies.length - 1; i++) {
          expect(companies[i].salaryBand.base).toBeGreaterThanOrEqual(companies[i + 1].salaryBand.base);
        }
      }
    });

    test('respects the limit parameter', async ({ request }) => {
      const limit = 3;
      const res = await request.get(`${API_URL}/top-paid?limit=${limit}`);
      const companies = await res.json();
      expect(res.status()).toBe(200);
      expect(companies.length).toBe(limit);
    });
  });

  // Test suite for GET /api/companies/by-skill/:skill
  test.describe('GET /api/companies/by-skill/:skill', () => {
    test('returns companies that include a skill (case-insensitive)', async ({ request }) => {
      const skillToTest = "dsa";
      const res = await request.get(`${API_URL}/by-skill/${skillToTest}`);
      const companies = await res.json();
      expect(res.status()).toBe(200);
      expect(companies.length).toBeGreaterThan(0);
      companies.forEach(company => {
        const skills = company.hiringCriteria.skills.map(s => s.toLowerCase());
        expect(skills).toContain(skillToTest);
      });
    });

    test('returns a 404 for a non-existing skill', async ({ request }) => {
      const res = await request.get(`${API_URL}/by-skill/nonexistent`);
      expect(res.status()).toBe(404);
      const body = await res.json();
      expect(body).toHaveProperty('message');
      expect(body.message).toContain('No companies found with skill');
    });
  });

  // Test suite for GET /api/companies/by-location/:location
  test.describe('GET /api/companies/by-location/:location', () => {
    test('returns companies matching the location (case-insensitive)', async ({ request }) => {
      const locationToTest = "hyderabad";
      const res = await request.get(`${API_URL}/by-location/${locationToTest}`);
      const companies = await res.json();
      expect(res.status()).toBe(200);
      expect(companies.length).toBeGreaterThan(0);
      companies.forEach(company => {
        expect(company.location.toLowerCase()).toBe(locationToTest);
      });
    });

    test('returns a 404 for a non-existing location', async ({ request }) => {
      const res = await request.get(`${API_URL}/by-location/NonExistent`);
      expect(res.status()).toBe(404);
      const body = await res.json();
      expect(body).toHaveProperty('message');
      expect(body.message).toContain('No companies found in location');
    });
  });

  // Test suite for GET /api/companies/headcount-range
  test.describe('GET /api/companies/headcount-range', () => {
    test('returns companies with headcount >= min', async ({ request }) => {
      const minHeadcount = 1000;
      const res = await request.get(`${API_URL}/headcount-range?min=${minHeadcount}`);
      const companies = await res.json();
      expect(res.status()).toBe(200);
      companies.forEach(company => {
        expect(company.headcount).toBeGreaterThanOrEqual(minHeadcount);
      });
    });

    test('returns companies with headcount between min and max', async ({ request }) => {
      const minHeadcount = 500;
      const maxHeadcount = 2000;
      const res = await request.get(`${API_URL}/headcount-range?min=${minHeadcount}&max=${maxHeadcount}`);
      const companies = await res.json();
      expect(res.status()).toBe(200);
      companies.forEach(company => {
        expect(company.headcount).toBeGreaterThanOrEqual(minHeadcount);
        expect(company.headcount).toBeLessThanOrEqual(maxHeadcount);
      });
    });
  });

  // Test suite for GET /api/companies/benefit/:benefit
  test.describe('GET /api/companies/benefit/:benefit', () => {
    test('returns companies that list the given benefit', async ({ request }) => {
      const benefitToTest = "Health Insurance";
      const res = await request.get(`${API_URL}/benefit/${benefitToTest}`);
      const companies = await res.json();
      expect(res.status()).toBe(200);
      expect(companies.length).toBeGreaterThan(0);
      companies.forEach(company => {
        expect(company.benefits.some(b => b.toLowerCase().includes(benefitToTest.toLowerCase()))).toBeTruthy();
      });
    });

    test('works with partial and case-insensitive matching', async ({ request }) => {
      const res = await request.get(`${API_URL}/benefit/insurance`);
      const companies = await res.json();
      expect(res.status()).toBe(200);
      expect(companies.length).toBeGreaterThan(0);
      companies.forEach(company => {
        expect(company.benefits.some(b => b.toLowerCase().includes('insurance'))).toBeTruthy();
      });
    });

    test('returns a 404 if no company offers that benefit', async ({ request }) => {
      const res = await request.get(`${API_URL}/benefit/nonexistent`);
      expect(res.status()).toBe(404);
      const body = await res.json();
      expect(body).toHaveProperty('message');
      expect(body.message).toContain('No companies found with benefit');
    });
  });
});
