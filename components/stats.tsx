import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
    ChartStyle,
  } from "./ui/chart"

  import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"


  export function Statistics () {
    return(
        <div className="flex flex-row gap-4">
            <Card>
                <CardHeader>
                    <CardTitle>Year Growth</CardTitle>
                </CardHeader>
                <CardContent>
                <ChartContainer config={chartConfig} className="h-[200px] w-full">
                        <BarChart accessibilityLayer data={chartData}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                            dataKey="month"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                            />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <ChartLegend content={<ChartLegendContent />} />
                            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
                            <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
                        </BarChart>
                    </ChartContainer>

                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Year Growth</CardTitle>
                </CardHeader>
                <CardContent>
                <ChartContainer config={chartConfig} className="h-[200px] w-full">
                        <BarChart accessibilityLayer data={chartData}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                            dataKey="month"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                            />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <ChartLegend content={<ChartLegendContent />} />
                            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
                            <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
                        </BarChart>
                    </ChartContainer>

                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Year Growth</CardTitle>
                </CardHeader>
                <CardContent>
                <ChartContainer config={chartConfig} className="h-[200px] w-full">
                        
                        <LineChart width={500} height={300} data={data}>
                            <XAxis dataKey="name"/>
                            <YAxis/>
                            <CartesianGrid stroke="#eee" strokeDasharray="5 5"/>
                            <Line type="monotone" dataKey="uv" stroke="#8884d8" />
                            <Line type="monotone" dataKey="pv" stroke="#82ca9d" />
                        </LineChart>
                    </ChartContainer>

                </CardContent>
            </Card>
        </div>
    )
  }


  const chartData = [
    { month: "January", previous: 186, current: 80 },
    { month: "February", previous: 305,  current:80 },
    { month: "March", previous: 237,  current:80 },
    { month: "April", previous: 73, current:890 },
    { month: "May", previous: 209,  current:80 },
    { month: "June", previous: 214, current:840 },
  ]
  
  import { type ChartConfig } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

  const chartConfig = {
    desktop: {
      label: "previous",
      color: "#2563eb",
    },
    mobile: {
      label: "current",
      color: "#60a5fa",
    },
  } satisfies ChartConfig
  const data = [{name: '2020', uv: 400, pv: 2400, amt: 2400}, {name:'2021',uv:600, pv:2600,amt:2600},{name:'2022', uc:800,pv:1000, amt:2800},{}];