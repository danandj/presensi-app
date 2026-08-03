import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,

                tabBarActiveTintColor: "#3F70FF",
                tabBarInactiveTintColor: "#8E97A8",

                tabBarStyle: {
                    height: 70,
                    paddingTop: 8,
                    paddingBottom: 8,
                    backgroundColor: "#0D121C",
                    borderTopColor: "#171D28",
                },

                tabBarLabelStyle: {
                    fontSize: 11,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",

                    tabBarIcon: ({
                        color,
                        focused,
                    }) => (
                        <Ionicons
                            name={
                                focused
                                    ? "home"
                                    : "home-outline"
                            }
                            size={23}
                            color={color}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="history"
                options={{
                    title: "History",

                    tabBarIcon: ({
                        color,
                        focused,
                    }) => (
                        <Ionicons
                            name={
                                focused
                                    ? "calendar"
                                    : "calendar-outline"
                            }
                            size={23}
                            color={color}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",

                    tabBarIcon: ({
                        color,
                        focused,
                    }) => (
                        <Ionicons
                            name={
                                focused
                                    ? "person"
                                    : "person-outline"
                            }
                            size={23}
                            color={color}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}