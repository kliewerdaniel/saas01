import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import DashboardPage from '../page'

// Mock recharts components to avoid canvas issues in tests
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="responsive-container">{children}</div>,
  BarChart: ({ children }: { children: React.ReactNode }) => <div data-testid="bar-chart">{children}</div>,
  LineChart: ({ children }: { children: React.ReactNode }) => <div data-testid="line-chart">{children}</div>,
  Bar: () => <div data-testid="bar" />,
  Line: () => <div data-testid="line" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
}))

describe('Dashboard Page', () => {
  it('renders dashboard title and description', () => {
    render(<DashboardPage />)

    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText("Welcome back! Here's your overview.")).toBeInTheDocument()
  })

  it('renders metric cards with correct values', () => {
    render(<DashboardPage />)

    expect(screen.getByText('Total Users')).toBeInTheDocument()
    expect(screen.getByText('1,234')).toBeInTheDocument()

    expect(screen.getByText('Revenue')).toBeInTheDocument()
    expect(screen.getByText('$45,231')).toBeInTheDocument()

    expect(screen.getByText('Active Jobs')).toBeInTheDocument()
    expect(screen.getByText('23')).toBeInTheDocument()

    expect(screen.getByText('Growth Rate')).toBeInTheDocument()
    expect(screen.getByText('+23.1%')).toBeInTheDocument()
  })

  it('renders chart sections', () => {
    render(<DashboardPage />)

    expect(screen.getByText('User Growth')).toBeInTheDocument()
    expect(screen.getByText('Monthly user acquisition over time')).toBeInTheDocument()

    expect(screen.getByText('Revenue Trend')).toBeInTheDocument()
    expect(screen.getByText('Monthly revenue progression')).toBeInTheDocument()

    expect(screen.getByTestId('bar-chart')).toBeInTheDocument()
    expect(screen.getByTestId('line-chart')).toBeInTheDocument()
  })

  it('renders recent activity section', () => {
    render(<DashboardPage />)

    expect(screen.getByText('Recent Activity')).toBeInTheDocument()
    expect(screen.getByText('Latest user actions and system events')).toBeInTheDocument()

    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Created new LLM job')).toBeInTheDocument()
    expect(screen.getByText('2 minutes ago')).toBeInTheDocument()
  })

  it('renders action buttons', () => {
    render(<DashboardPage />)

    expect(screen.getByText('New Job')).toBeInTheDocument()
    expect(screen.getByText('Settings')).toBeInTheDocument()
  })

  it('renders all metric icons', () => {
    render(<DashboardPage />)

    // Check that icons are rendered (they render as SVG elements)
    const icons = screen.getAllByRole('img', { hidden: true })
    expect(icons.length).toBeGreaterThan(0)
  })
})
