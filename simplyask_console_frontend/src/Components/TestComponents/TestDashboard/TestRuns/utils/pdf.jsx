import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

import { getInFormattedUserTimezone } from '../../../../../utils/timeUtil';

const getUniqEnvs = (testRunSuites) => {
  const envs = testRunSuites
    .map((testCase) => testCase.testRunCases.map((runCase) => runCase.envStatuses))
    .flat(2)
    .map((item) => item.environment);

  return [...new Set(envs)];
};

const generateHead = (envs) => [
  [
    { content: 'Test Suites', rowSpan: 2, dataKey: 'testSuite' },
    { content: 'Test Cases', rowSpan: 2, dataKey: 'testCase' },
    { content: 'Environment Status', colSpan: envs.length, dataKey: 'envStatus' },
    { content: 'Comments', rowSpan: 2, dataKey: 'comment' },
  ],
  envs.map((env) => ({ content: env, dataKey: env })),
];

const generateBody = (suites, envs, timezone) => {
  return suites
    .map((suite) => {
      const sortedTestRunCases = [...suite.testRunCases].sort((a, b) => a.name.localeCompare(b.name));

      return sortedTestRunCases.map((testCase, index) => [
        ...(index === 0
          ? [
              {
                content:
                  `${suite.testSuiteName}\n` +
                  '\n' +
                  `Number of Test Cases: ${suite.numOfTestCases}\n` +
                  `Executed At: ${getInFormattedUserTimezone(suite.executionDate, timezone)}\n` +
                  // eslint-disable-next-line no-mixed-operators
                  `Passed (All Env): ${suite.numOfTestCasesPassed} / ${suite.numOfTestCases} Cases (${Math.floor((suite.numOfTestCasesPassed / suite.numOfTestCases) * 100)}%)`,
                url: `${window.origin}/test/history?${new URLSearchParams({
                  displayName: suite.testSuiteName,
                  testSuiteExecutionId: suite.testSuiteExecutionId,
                }).toString()}`,
              },
            ]
          : ['']),
        testCase.name,
        ...envs.map((env) => {
          const currentEnv = testCase.envStatuses.find((envStatus) => envStatus.environment === env);

          return {
            content: currentEnv?.result,
            url: ['PASS', 'FAIL'].includes(currentEnv?.result)
              ? `${window.origin}/test/history?${new URLSearchParams({
                  displayName: testCase.name,
                  testSuiteExecutionId: suite.testSuiteExecutionId,
                  testCaseExecutionId: currentEnv?.testCaseExecutionId,
                }).toString()}`
              : '',
          };
        }),
        testCase.comments,
      ]);
    })
    .flat();
};

export const generateTestRunsPDF = (obj, timezone) => {
  // eslint-disable-next-line new-cap
  const doc = new jsPDF({
    orientation: 'l',
    unit: 'px',
    format: 'letter',
  });

  html2canvas(document.getElementById('testRuns'), {
    backgroundColor: 'white',
    windowWidth: 1600,
  }).then((canvas) => {
    const DOCUMENT_PADDING_TOP = 10;
    const DOCUMENT_PADDING_BOTTOM = 10;
    const DOCUMENT_PADDING_LEFT = 10;
    const DOCUMENT_PADDING_RIGHT = 10;

    const imgData = canvas.toDataURL('image/png');
    const width = doc.internal.pageSize.getWidth() - (DOCUMENT_PADDING_LEFT + DOCUMENT_PADDING_RIGHT);
    // eslint-disable-next-line no-mixed-operators
    const height = (canvas.height * width) / canvas.width;
    doc.addImage(imgData, 'PNG', DOCUMENT_PADDING_LEFT, DOCUMENT_PADDING_TOP, width, height);

    // Set up the table header
    const envs = getUniqEnvs(obj.testRunSuites);
    const envsIndexes = envs.map((_, index) => index + 2);
    const head = generateHead(envs);

    // Set up the data for the table
    const body = generateBody(obj.testRunSuites, envs, timezone);

    const envStyleRules = envsIndexes.reduce((acc, el) => {
      acc[el] = {
        overflow: 'visible',
      };

      return acc;
    }, {});

    autoTable(doc, {
      head,
      body,
      startY: height + DOCUMENT_PADDING_TOP,
      rowPageBreak: 'avoid',
      showHead: 'firstPage',
      margin: {
        top: DOCUMENT_PADDING_TOP,
        right: DOCUMENT_PADDING_RIGHT,
        bottom: DOCUMENT_PADDING_BOTTOM,
        left: DOCUMENT_PADDING_LEFT,
      },
      theme: 'plain',
      tableLineWidth: 0.1,
      tableLineColor: [207, 211, 218],
      styles: {
        halign: 'center',
        valign: 'middle',
        lineWidth: 0.1,
        lineColor: [207, 211, 218],
        fontSize: 10,
      },
      headStyles: {
        lineWidth: 0.1,
        tableLineColor: [207, 211, 218],
        fillColor: [254, 242, 233],
        textColor: [45, 58, 71],
      },
      bodyStyles: {
        cellPadding: 10,
        fillColor: [255, 255, 255],
        textColor: [45, 58, 71],
      },
      columnStyles: {
        0: {
          cellWidth: 150,
          valign: 'top',
          halign: 'left',
        },
        1: {
          cellWidth: 100,
        },
        ...envStyleRules,
      },
      didParseCell: ({ cell, column, row }) => {
        // Make Environment Statuses GREEN or RED based on PASS/FAIL
        if (row.section === 'body' && envsIndexes.includes(column.dataKey)) {
          if (cell.raw.content === 'PASS') {
            cell.styles.textColor = 'green';
          } else if (cell.raw.content === 'FAIL') {
            cell.styles.textColor = 'red';
          } else {
            cell.text = 'n/a';
          }
        }
      },
      didDrawCell: ({ row, cell }) => {
        // Add links to columns where it required
        if (row.section === 'body') {
          const url = cell.raw?.url;

          if (url) {
            doc.link(cell.x, cell.y, cell.width, cell.height, { url });
          }
        }

        // Draw black line after each Test Suite
        if (row.section === 'body' && row.raw[0]) {
          doc.setFillColor(0, 0, 0);
          doc.rect(cell.x, cell.y, cell.width, 1, 'F');
        } else if (row.section === 'body' && !row.raw[0]) {
          const c = row.cells[0];
          doc.setFillColor('#FFFFFF');
          doc.rect(c.x, c.y - 1, c.width - 0.2, 2, 'F');
        }
      },
    });

    doc.save(`${getInFormattedUserTimezone(new Date(), timezone, 'MM-dd-yyyy')}_${obj.displayName}.pdf`);
  });
};
