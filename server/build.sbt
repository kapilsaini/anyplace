import com.typesafe.sbt.packager.MappingsHelper._
mappings in Universal ++= directory(baseDirectory.value / "floor_plans")

name := "anyplace_v3"

version := "4.0"

scalaVersion := "2.12.6"

libraryDependencies ++= Seq( jdbc , cache , ws   , specs2 % Test )

libraryDependencies ++= Seq(
  // Add here the specific dependencies for this module:
  filters
)

libraryDependencies += guice

//Required for ACCES
libraryDependencies += "com.github.danielkorzekwa" % "bayes-scala-gp_2.11" % "0.1-SNAPSHOT"

libraryDependencies += "com.couchbase.client" % "java-client" % "2.7.2"

resolvers += "scalaz-bintray" at "https://dl.bintray.com/scalaz/releases"

resolvers += Resolver.sonatypeRepo("snapshots")

unmanagedResourceDirectories in Test += { baseDirectory ( _ /"target/web/public/test" ) }.value

javaOptions += "-Dfile.encoding=UTF-8"

//Required for ACCES
libraryDependencies += "com.github.danielkorzekwa" % "bayes-scala-gp_2.11" % "0.1-SNAPSHOT"

resolvers += Resolver.sonatypeRepo("snapshots")

resolvers ++= Seq(
  // other resolvers here
  // if you want to use snapshot builds (currently 0.12-SNAPSHOT), use this.
  "Sonatype Snapshots" at "https://oss.sonatype.org/content/repositories/snapshots/",
  "Sonatype Releases" at "https://oss.sonatype.org/content/repositories/releases/"
)


sources in (Compile, doc) := Seq.empty
publishArtifact in (Compile, packageDoc) := false

lazy val `anyplace_v3` = (project in file(".")).enablePlugins(PlayScala)

