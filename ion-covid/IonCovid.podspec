
  Pod::Spec.new do |s|
    s.name = 'IonCovid'
    s.version = '0.0.1'
    s.summary = '-'
    s.license = 'MIT'
    s.homepage = '-'
    s.author = 'Bahyu Sanciko'
    s.source = { :git => '-', :tag => s.version.to_s }
    s.source_files = 'ios/Plugin/**/*.{swift,h,m,c,cc,mm,cpp}'
    s.ios.deployment_target  = '11.0'
    s.dependency 'Capacitor'
  end